/* eslint react/jsx-props-no-spreading: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import { get, set } from 'lodash/object'
import { useAuth } from '../utils/auth/hooks'
import { addSession } from '../utils/middleware/cookieSession'
import { isServerSide } from '../utils/ssr'

const withUserHOC = ComposedComponent => {
  const WithUserComp = props => {
    const { authUserFromSession, authUserToken, ...otherProps } = props

    // We'll use the authed user from client-side auth (Firebase JS SDK)
    // when available. On the server side, we'll use the authed user from
    // the session. This allows us to server-render while also using Firebase's
    // client-side auth functionality.
    // Note: we need to destroy the session when logging out with the Firebase
    // JS SDK.
    const { user: authUserFromClient } = useAuth()
    const authUser = authUserFromClient || authUserFromSession || null

    return (
      <ComposedComponent
        {...otherProps}
        authUser={authUser}
        authUserToken={authUserToken}
      />
    )
  }

  WithUserComp.getInitialProps = async ctx => {
    const { req, res } = ctx

    // Add session info to the request.
    if (isServerSide()) {
      addSession(req, res)
    }

    // Get the user and user token from the session.
    const authUserFromSession = get(req, 'session.decodedToken', null)
    const authUserToken = get(req, 'session.token', null)

    // Explicitly add the user to a custom prop in the getInitialProps
    // context for ease of use.
    set(ctx, 'tabCustomData.authUser', authUserFromSession)
    set(ctx, 'tabCustomData.authUserToken', authUserToken)

    // Evaluate the composed component's getInitialProps()
    return ComposedComponent.getInitialProps(ctx)
  }

  WithUserComp.displayName = `WithUser(${ComposedComponent.displayName})`

  WithUserComp.propTypes = {
    authUserFromSession: PropTypes.shape({
      // TODO: define more properties
      sub: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }),
    authUserToken: PropTypes.string,
  }

  WithUserComp.defaultProps = {
    authUserFromSession: null,
    authUserToken: null,
  }

  return WithUserComp
}

export default withUserHOC

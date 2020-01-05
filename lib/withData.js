/* eslint react/jsx-props-no-spreading: 0 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from './createRelayEnvironment'
import { useAuth } from '../utils/auth/hooks'
import { addSession } from '../utils/middleware/cookieSession'
import { isServerSide } from '../utils/ssr'

// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

// TODO: we likely want to break out `withUser` logic into its own
//   hook or HOC and handle redirection to sign-in. Then, each page
//   can set its own "userId" Relay variable.
export default (ComposedComponent, { query, variables = {} }) => {
  const WithDataComp = props => {
    const { authUserFromSession, queryRecords, ...otherProps } = props
    const [environment] = useState(
      initEnvironment({
        records: queryRecords,
      })
    )

    // We'll use the authed user from client-side auth (Firebase JS SDK)
    // when available. On the server side, we'll use the authed user from
    // the session. This allows us to server-render while also using Firebase's
    // client-side auth functionality.
    // Note: we need to destroy the session when logging out with the Firebase
    // JS SDK.
    const { user: authUserFromClient } = useAuth()
    const authUser = authUserFromClient || authUserFromSession || null

    // Add the userId variable by default.
    const userId = get(authUser, 'sub', null)
    const variablesWithUserId = {
      userId,
      ...variables,
    }

    return (
      <ReactRelayContext.Provider
        value={{ environment, variables: variablesWithUserId }}
      >
        <ComposedComponent {...otherProps} authUser={authUser} />
      </ReactRelayContext.Provider>
    )
  }

  WithDataComp.getInitialProps = async ctx => {
    const { req, res } = ctx

    // Add session info to the request.
    if (isServerSide()) {
      addSession(req, res)
    }

    // Get the user and user token from the session.
    const authUserFromSession = get(req, 'session.decodedToken', null)
    const authUserToken = get(req, 'session.token', null)
    const userId = get(authUserFromSession, 'sub', null)

    // Evaluate the composed component's getInitialProps()
    let composedInitialProps = {}
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    let queryProps = {}
    let queryRecords = {}
    const environment = initEnvironment()

    if (query) {
      // Add the userId variable by default.
      const variablesWithUserId = {
        userId,
        ...variables,
      }

      // TODO: Consider RelayQueryResponseCache
      // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
      queryProps = await fetchQuery(environment, query, variablesWithUserId, {
        token: authUserToken,
      })
      queryRecords = environment
        .getStore()
        .getSource()
        .toJSON()
    }

    return {
      ...composedInitialProps,
      ...queryProps,
      queryRecords,
      authUserFromSession,
    }
  }

  WithDataComp.displayName = `WithData(${ComposedComponent.displayName})`

  WithDataComp.propTypes = {
    authUserFromSession: PropTypes.shape({
      // TODO: define more properties
      sub: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }),
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
  }

  WithDataComp.defaultProps = {
    authUserFromSession: null,
  }

  return WithDataComp
}

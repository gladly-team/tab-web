/* eslint react/jsx-props-no-spreading: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { redirect, setWindowLocation } from 'src/utils/navigation'
import { authURL } from 'src/utils/urls'
import { isClientSide } from 'src/utils/ssr'

// Redirects to the authentication page if the user is not logged in.
// This should wrap any other higher-order components that expect the
// user to exist.
export default ComposedComponent => {
  const AuthRequiredComp = props => {
    const { AuthUserInfo } = props

    // If there is not an authed user, redirect to the auth page.
    if (isClientSide() && !get(AuthUserInfo, 'AuthUser')) {
      // TODO: add ?next=[location] URL param to redirects.
      // Important: we must fully refresh the page to ensure the AuthUserInfo
      // is reset when calling `getInitialProps` on the next page.
      setWindowLocation(authURL)
      return null
    }
    return <ComposedComponent {...props} />
  }

  AuthRequiredComp.getInitialProps = async ctx => {
    // Get the AuthUserInfo object. This is set in _app.js.
    const AuthUserInfo = get(ctx, 'tabCustomData.AuthUserInfo', null)
    let composedInitialProps = {}

    // If there is no authed user, redirect to the authentication page.
    if (!get(AuthUserInfo, 'AuthUser')) {
      redirect({
        location: authURL,
        ctx,
      })
    } else if (ComposedComponent.getInitialProps) {
      // Only evaluate the composed component's getInitialProps() if we are
      // not redirecting.
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    return {
      ...composedInitialProps,
    }
  }

  AuthRequiredComp.displayName = `AuthRequired(${ComposedComponent.displayName})`

  AuthRequiredComp.propTypes = {
    AuthUserInfo: PropTypes.shape({
      AuthUser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        emailVerified: PropTypes.bool.isRequired,
      }),
      token: PropTypes.string,
    }).isRequired,
  }

  AuthRequiredComp.defaultProps = {}

  return AuthRequiredComp
}

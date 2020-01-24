/* eslint react/jsx-props-no-spreading: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { redirect } from 'src/utils/navigation'
import { authURL } from 'src/utils/urls'

// Redirects to the authentication page if the user is not logged in.
export default ComposedComponent => {
  const AuthRequiredComp = props => {
    return <ComposedComponent {...props} />
  }

  AuthRequiredComp.getInitialProps = async ctx => {
    // Get the AuthUserInfo object. This is set in _app.js.
    const AuthUserInfo = get(ctx, 'tabCustomData.AuthUserInfo', null)

    // If there is no authed user, redirect to the authentication page.
    if (!get(AuthUserInfo, 'AuthUser')) {
      redirect({
        location: authURL,
        ctx,
      })
    }

    // Evaluate the composed component's getInitialProps().
    let composedInitialProps = {}
    if (ComposedComponent.getInitialProps) {
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

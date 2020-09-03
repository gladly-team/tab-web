/* eslint react/jsx-props-no-spreading: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { AuthUserInfoContext } from 'src/utils/auth/hooks'
import {
  NEXT_CTX_CUSTOM_DATA_KEY,
  NEXT_CTX_AUTH_USER_INFO_KEY,
} from 'src/utils/constants'

const WithAuthUserInfo = ComposedComponent => {
  const WithAuthUserInfoComp = (props) => {
    const { AuthUserInfo: AuthUserInfoFromSession, ...otherProps } = props
    return (
      <AuthUserInfoContext.Consumer>
        {(AuthUserInfo) => (
          <ComposedComponent
            {...otherProps}
            AuthUserInfo={AuthUserInfo || AuthUserInfoFromSession}
          />
        )}
      </AuthUserInfoContext.Consumer>
    )
  }

  WithAuthUserInfoComp.getInitialProps = async (ctx) => {
    // Get the AuthUserInfo object. This is set in _app.js.
    const AuthUserInfo = get(
      ctx,
      [NEXT_CTX_CUSTOM_DATA_KEY, NEXT_CTX_AUTH_USER_INFO_KEY],
      null
    )

    // Evaluate the composed component's getInitialProps().
    let composedInitialProps = {}
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    return {
      ...composedInitialProps,
      AuthUserInfo,
    }
  }

  WithAuthUserInfoComp.displayName = `WithAuthUserInfo(${ComposedComponent.displayName})`

  WithAuthUserInfoComp.propTypes = {
    AuthUserInfo: PropTypes.shape({
      AuthUser: PropTypes.shape({
        id: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        emailVerified: PropTypes.bool.isRequired,
      }),
      token: PropTypes.string, // user might not be authed on all pages
      isClientInitialized: PropTypes.bool.isRequired,
    }).isRequired,
  }

  WithAuthUserInfoComp.defaultProps = {}

  return WithAuthUserInfoComp
};

// Provides an AuthUserInfo prop to the composed component.
export default WithAuthUserInfo;

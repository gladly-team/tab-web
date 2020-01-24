/* eslint react/jsx-props-no-spreading: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { AuthUserInfoContext } from 'src/utils/auth/hooks'

// Provides an AuthUserInfo prop to the composed component.
export default ComposedComponent => {
  const WithAuthUserInfoComp = props => {
    const { AuthUserInfo: AuthUserInfoFromSession, ...otherProps } = props
    return (
      <AuthUserInfoContext.Consumer>
        {AuthUserInfo => (
          <ComposedComponent
            {...otherProps}
            AuthUserInfo={AuthUserInfo || AuthUserInfoFromSession}
          />
        )}
      </AuthUserInfoContext.Consumer>
    )
  }

  WithAuthUserInfoComp.getInitialProps = async ctx => {
    // Get the AuthUserInfo object. This is set in _app.js.
    const AuthUserInfo = get(ctx, 'tabCustomData.AuthUserInfo', null)

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
      token: PropTypes.string,
    }).isRequired,
  }

  WithAuthUserInfoComp.defaultProps = {}

  return WithAuthUserInfoComp
}

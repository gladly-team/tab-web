import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import FirebaseAuth from 'src/components/FirebaseAuth'
import withAuthUserInfo from 'src/utils/pageWrappers/withAuthUserInfo'
import { redirect, setWindowLocation } from 'src/utils/navigation'
import { dashboardURL } from 'src/utils/urls'

const Auth = props => {
  const { AuthUserInfo } = props

  const navigateToPostAuthPage = () => {
    // TODO: use ?next=[location] URL param to redirects.

    // Important: we must fully refresh the page to ensure the AuthUserInfo
    // exists when calling `getInitialProps`. Alternatively, we can
    // manually set the user info in the DOM (e.g., see `setAuthUserInfoInDOM` in
    // src/utils/auth/user.js), but this is simpler.
    // For additional context, see _app.js, _document.js, and these issues:
    // https://github.com/zeit/next.js/issues/3043#issuecomment-334521241
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    setWindowLocation(dashboardURL)
  }

  // If there is an authed user, redirect to the app. This may happen
  // if the session is invalid or doesn't exist but the user has a valid
  // token on the client. We treat the token as the source of truth for
  // authentication.
  if (get(AuthUserInfo, 'AuthUser')) {
    navigateToPostAuthPage()
  }

  return (
    <div>
      <p>Sign in</p>
      <div>
        <FirebaseAuth onSuccessfulAuth={navigateToPostAuthPage} />
      </div>
    </div>
  )
}

Auth.getInitialProps = async ctx => {
  const AuthUserInfo = get(ctx, 'tabCustomData.AuthUserInfo', null)

  // If there is an authed user, redirect to the app.
  if (get(AuthUserInfo, 'AuthUser')) {
    redirect({
      // TODO: use ?next=[location] URL param to redirects.
      location: dashboardURL,
      ctx,
    })
  }

  return {}
}

Auth.displayName = 'Auth'

Auth.propTypes = {
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
  }),
}

Auth.defaultProps = {
  AuthUserInfo: null,
}

export default withAuthUserInfo(Auth)

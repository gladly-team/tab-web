import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import FirebaseAuth from 'src/components/FirebaseAuth'
import FullPageLoader from 'src/components/FullPageLoader'
import withAuthUserInfo from 'src/utils/pageWrappers/withAuthUserInfo'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { isClientSide } from 'src/utils/ssr'
import { redirect, setWindowLocation } from 'src/utils/navigation'
import { dashboardURL } from 'src/utils/urls'
import {
  NEXT_CTX_CUSTOM_DATA_KEY,
  NEXT_CTX_AUTH_USER_INFO_KEY,
} from 'src/utils/constants'

const Auth = props => {
  const { AuthUserInfo } = props

  const shouldRedirect =
    isClientSide() &&
    get(AuthUserInfo, 'AuthUser') &&
    AuthUserInfo.isClientInitialized

  useEffect(() => {
    // If there is an authed user, redirect to the app. AuthUser will be
    // become defined on a successful login. The user might also already
    // be authed when visiting this page if the session is invalid or
    // doesn't exist (so the server redirected here) but the user has a valid
    // token on the client. We treat the token as the source of truth for
    // authentication.
    if (shouldRedirect) {
      const redirectToApp = async () => {
        // Clear the cache so it can be updated with content specific
        // to the authed user.
        await clearAllServiceWorkerCaches()

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
      redirectToApp()
    }
  }, [shouldRedirect])

  // If Firebase hasn't initialized yet, or we are in the process of
  // redirecting, show a loading message. Here, the user might be authed
  // but not have auth cookies set, so we don't want to flash the sign-in
  // dialog.
  if (!AuthUserInfo.isClientInitialized || shouldRedirect) {
    return <FullPageLoader />
  }

  return (
    <div>
      <p>Sign in</p>
      <div>
        <FirebaseAuth />
      </div>
    </div>
  )
}

Auth.getInitialProps = async ctx => {
  const AuthUserInfo = get(
    ctx,
    [NEXT_CTX_CUSTOM_DATA_KEY, NEXT_CTX_AUTH_USER_INFO_KEY],
    null
  )

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
    token: PropTypes.string, // user likely isn't authed on this page
    isClientInitialized: PropTypes.bool.isRequired,
  }),
}

Auth.defaultProps = {
  AuthUserInfo: null,
}

export default withAuthUserInfo(Auth)

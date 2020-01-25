import React, { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { createAuthUserInfo, setAuthUserInfoInDOM } from 'src/utils/auth/user'
import { isClientSide } from 'src/utils/ssr'
import initFirebase from 'src/utils/auth/initFirebase'
import { redirect } from 'src/utils/navigation'
import { dashboardURL } from 'src/utils/urls'

// Init the Firebase app.
initFirebase()

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false)
  useEffect(() => {
    if (isClientSide()) {
      setRenderAuth(true)
    }
  }, [])

  // When waiting for sign in to complete, show a loader.
  const [isWaitingOnSignIn, setIsWaitingOnSignIn] = useState(false)

  // Called on successful sign-in.
  const signInSuccessCallback = async authResult => {
    setIsWaitingOnSignIn(true)

    // Add the AuthUserInfo to the DOM as JSON. This is used in _document.js
    // to provide the AuthUserInfo to pages' `getInitialProps`. Without setting
    // it in DOM, pages that require authentication would automatically redirect
    // back to the authentication page. For additional context, see _app.js,
    // _document.js, and these issues:
    // https://github.com/zeit/next.js/issues/3043#issuecomment-334521241
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    const { user: firebaseUser } = authResult
    const token = await firebaseUser.getIdToken()
    const AuthUserInfo = createAuthUserInfo({
      firebaseUser,
      token,
    })
    setAuthUserInfoInDOM(AuthUserInfo)

    // TODO: use ?next=[location] URL param to redirects.
    redirect({
      location: dashboardURL,
    })
  }

  const firebaseAuthConfig = {
    // Either 'popup' or 'redirect'
    signInFlow: 'popup',
    // Auth providers
    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        scopes: ['https://www.googleapis.com/auth/userinfo.email'],
      },
      {
        provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        scopes: ['email'],
      },
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
    ],
    signInSuccessUrl: dashboardURL,
    callbacks: {
      // Does not support async functions.
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        signInSuccessCallback(authResult, redirectUrl)

        // Do not automatically redirect to the signInSuccessUrl.
        return false
      },
    },
    // Just using the constant rather than importing firebaseui
    // https://github.com/firebase/firebaseui-web#credential-helper
    // https://github.com/firebase/firebaseui-web/blob/bd710448caa34c4a47a2fd578d76be8506d392d8/javascript/widgets/config.js#L83
    credentialHelper: 'none',
  }

  return (
    <div>
      {renderAuth && !isWaitingOnSignIn ? (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : null}
      {renderAuth && isWaitingOnSignIn ? (
        <div style={{ textAlign: 'center', margin: 40 }}>Signing in...</div>
      ) : null}
    </div>
  )
}

FirebaseAuth.displayName = 'FirebaseAuth'

export default FirebaseAuth

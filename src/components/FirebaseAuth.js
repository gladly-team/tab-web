import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { isClientSide } from 'src/utils/ssr'
import initFirebase from 'src/utils/auth/initFirebase'
import { dashboardURL } from 'src/utils/urls'

// Init the Firebase app.
initFirebase()

const FirebaseAuth = props => {
  const { onSuccessfulAuth } = props

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
      signInSuccessWithAuthResult: () => {
        setIsWaitingOnSignIn(true)

        if (onSuccessfulAuth) {
          onSuccessfulAuth()
        }

        // Do not automatically redirect to the signInSuccessUrl.
        // We handle redirection by listening to the existence of
        // the AuthUser object in auth.js.
        return false
      },
    },
    // Just using the constant rather than importing firebaseui
    // https://github.com/firebase/firebaseui-web#credential-helper
    // https://github.com/firebase/firebaseui-web/blob/bd710448caa34c4a47a2fd578d76be8506d392d8/javascript/widgets/config.js#L83
    credentialHelper: 'none',
  }

  let signInMenu
  if (renderAuth) {
    if (isWaitingOnSignIn) {
      signInMenu = (
        <div style={{ textAlign: 'center', margin: 40 }}>Signing in...</div>
      )
    } else {
      signInMenu = (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={firebase.auth()}
        />
      )
    }
  }

  return <div>{signInMenu}</div>
}

FirebaseAuth.displayName = 'FirebaseAuth'

FirebaseAuth.propTypes = {
  onSuccessfulAuth: PropTypes.func,
}

FirebaseAuth.defaultProps = {
  onSuccessfulAuth: () => {},
}

export default FirebaseAuth

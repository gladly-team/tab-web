import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'

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
  signInSuccessUrl: '/',
  // Just using the constant rather than importing firebaseui
  // https://github.com/firebase/firebaseui-web#credential-helper
  // https://github.com/firebase/firebaseui-web/blob/bd710448caa34c4a47a2fd578d76be8506d392d8/javascript/widgets/config.js#L83
  credentialHelper: 'none',
}

const FirebaseAuth = () => {
  return (
    <StyledFirebaseAuth
      uiConfig={firebaseAuthConfig}
      firebaseAuth={firebase.auth()}
    />
  )
}

export default FirebaseAuth

import React, { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from 'src/utils/auth/initFirebase'
import { setSession } from 'src/utils/auth/firebaseSessionHandler'
import { createAuthUserInfo } from 'src/utils/auth/user'

initFirebase()

// https://benmcmahen.com/using-firebase-with-react-hooks/

// Defaults to empty AuthUserInfo object.
export const AuthUserInfoContext = React.createContext(createAuthUserInfo())

export const useAuthUserInfo = () => {
  return React.useContext(AuthUserInfoContext)
}

// FIXME: using this hook more than once will call the `onChange`
// callback multiple times unnecessarily.
// TODO: refactor this into a hook that returns AuthUserInfo.

// Returns a Firebase JS SDK user object.
export const useFirebaseAuth = () => {
  const [state, setState] = useState(() => {
    const user = firebase.auth().currentUser
    return {
      initializing: !user,
      user,
    }
  })

  async function onChange(user) {
    // When the user logs in or out to Firebase, call the server
    // to update their session. We must wait for the session to be
    // set before changing the user state because we want server-side
    // rendering to match client-side user state.

    try {
      await setSession(user)
    } catch (e) {
      // TODO: log error
      console.error(e) // eslint-disable-line no-console
    }

    setState({ initializing: false, user })
  }

  useEffect(() => {
    // Listen for auth state changes.
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    // Unsubscribe to the listener when unmounting.
    return () => unsubscribe()
  }, [])

  return state
}

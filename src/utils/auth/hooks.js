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
    // Call server to update session. We need this to complete
    // before setting the user state to ensure the session exists
    // and thus server-side rendering will behave like client-side
    // rendering.
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

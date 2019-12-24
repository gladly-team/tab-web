/* eslint import/prefer-default-export: 0 */

import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from './initFirebase'
import { setSession } from './firebaseSessionHandler'

initFirebase()

// https://benmcmahen.com/using-firebase-with-react-hooks/

export const useAuth = () => {
  const [state, setState] = React.useState(() => {
    const user = firebase.auth().currentUser
    return {
      initializing: !user,
      user,
    }
  })

  function onChange(user) {
    setState({ initializing: false, user })

    // Call server to update session.
    setSession(user)
  }

  React.useEffect(() => {
    // Listen for auth state changes.
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    // Unsubscribe to the listener when unmounting.
    return () => unsubscribe()
  }, [])

  return state
}

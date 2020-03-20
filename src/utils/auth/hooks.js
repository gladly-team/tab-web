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

  // FIXME: we need the user's token when unsetting the session on logout,
  //   and we only want to subscribe to firebase auth changes once.
  useEffect(() => {
    async function onChange(user) {
      // When the user logs in or out to Firebase, call the server
      // to update their session. We must wait for the session to be
      // set before changing the user state because we want server-side
      // rendering to match client-side user state.
      try {
        // If the Firebase user exists, the "shouldLogin" value is true,
        // which means we'll call to set the session. The "user" value
        // will either be the current user state or, if logging out, the
        // user state immediately before logout. We need the Firebase user
        // during logout so that we can send the user token to the logout
        // endpoint to authorize logout. Using a token instead of relying
        // on the session protects against CSRF attacks.
        await setSession({ shouldLogin: !!user, user: user || state.user })
      } catch (e) {
        // TODO: log error
        console.error(e) // eslint-disable-line no-console
      }

      setState({ initializing: false, user })
    }

    // Listen for auth state changes.
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    // Unsubscribe to the listener when unmounting.
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // FIXME

  return state
}

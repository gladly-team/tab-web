import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from './initFirebase'

initFirebase()

// https://benmcmahen.com/using-firebase-with-react-hooks/
export const UserContext = React.createContext({
  user: null,
})

export const useSession = () => {
  const { user } = React.useContext(UserContext)
  return user
}

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
  }

  React.useEffect(() => {
    // Listen for auth state changes.
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)

    // Unsubscribe to the listener when unmounting.
    return () => unsubscribe()
  }, [])

  return state
}

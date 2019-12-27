import React from 'react'
import FirebaseAuth from '../components/FirebaseAuth'

const Auth = () => {
  // FIXME: do not SSR FirebaseAuth.
  // https://github.com/firebase/firebaseui-web/issues/213
  return (
    <div>
      <p>Sign in</p>
      <div>
        <FirebaseAuth />
      </div>
    </div>
  )
}

Auth.propTypes = {}

export default Auth

import React from 'react'
import FirebaseAuth from 'src/components/FirebaseAuth'

// TODO: if there is an authed user, redirect to the app.

const Auth = () => {
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

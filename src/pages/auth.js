import React from 'react'
import FirebaseAuth from 'src/components/FirebaseAuth'

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

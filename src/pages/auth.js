import React from 'react'
import { get } from 'lodash/object'
import FirebaseAuth from 'src/components/FirebaseAuth'
import withAuthUserInfo from 'src/utils/pageWrappers/withAuthUserInfo'
import { redirect } from 'src/utils/navigation'
import { dashboardURL } from 'src/utils/urls'

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

Auth.getInitialProps = async ctx => {
  const AuthUserInfo = get(ctx, 'tabCustomData.AuthUserInfo', null)

  // If there is an authed user, redirect to the app.
  if (get(AuthUserInfo, 'AuthUser')) {
    redirect({
      location: dashboardURL,
      ctx,
    })
  }

  return {}
}

Auth.displayName = 'Auth'
Auth.propTypes = {}
Auth.defaultProps = {}

export default withAuthUserInfo(Auth)

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import FirebaseAuth from 'src/components/FirebaseAuth'
import withAuthUserInfo from 'src/utils/pageWrappers/withAuthUserInfo'
import { redirect } from 'src/utils/navigation'
import { dashboardURL } from 'src/utils/urls'
import { isClientSide } from 'src/utils/ssr'

const Auth = props => {
  const { AuthUserInfo } = props

  // TODO: probably just server-side redirect in getInitialProps.
  // Client-side redirect.
  useEffect(() => {
    if (isClientSide()) {
      const AuthUser = get(AuthUserInfo, 'AuthUser', null)
      if (AuthUser) {
        redirect({
          location: dashboardURL,
        })
      }
    }
  })

  return (
    <div>
      <p>Sign in</p>
      <div>
        <FirebaseAuth />
      </div>
    </div>
  )
}

Auth.displayName = 'Auth'

Auth.propTypes = {
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
  }),
}

Auth.defaultProps = {
  AuthUserInfo: null,
}

export default withAuthUserInfo(Auth)

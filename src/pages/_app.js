/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { get, set } from 'lodash/object'
import { AuthUserInfoContext, useFirebaseAuth } from 'src/utils/auth/hooks'
import {
  createAuthUser,
  createAuthUserInfo,
  getAuthUserInfoFromDOM,
} from 'src/utils/auth/user'
import { addSession } from 'src/utils/middleware/cookieSession'
import { isServerSide } from 'src/utils/ssr'

const App = props => {
  const { AuthUserInfo, Component, pageProps } = props

  // We'll use the authed user from client-side auth (Firebase JS SDK)
  // when available. On the server side, we'll use the authed user from
  // the session. This allows us to server-render while also using Firebase's
  // client-side auth functionality.
  // Note: we need to destroy the session when logging out with the Firebase
  // JS SDK. We also need to destroy the "__TAB_WEB_AUTH_USER_INFO" script.
  const { initializing, user: firebaseUser } = useFirebaseAuth()
  const AuthUserFromClient = createAuthUser(firebaseUser)
  const { AuthUser: AuthUserFromSession, token } = AuthUserInfo

  let AuthUser = null
  if (AuthUserFromClient) {
    AuthUser = AuthUserFromClient
  } else if (initializing && AuthUserFromSession) {
    // On the client side, only use the AuthUserFromSession if the Firebase
    // user info is still initializing. This allows us to ignore the
    // AuthUserFromSession when the user logs out on the client.
    AuthUser = AuthUserFromSession
  }
  return (
    <AuthUserInfoContext.Provider value={{ AuthUser, token }}>
      <Component {...pageProps} />
    </AuthUserInfoContext.Provider>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { req, res } = ctx

  // Get the AuthUserInfo object.
  let AuthUserInfo
  if (isServerSide()) {
    // If server-side, get AuthUserInfo from the session in the request.
    addSession(req, res)
    AuthUserInfo = createAuthUserInfo({
      firebaseUser: get(req, 'session.decodedToken', null),
      token: get(req, 'session.token', null),
    })
  } else {
    // If client-side, get AuthUserInfo from stored data. We store it
    // in _document.js. See:
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    AuthUserInfo = getAuthUserInfoFromDOM()
  }

  // Explicitly add the user to a custom prop in the getInitialProps
  // context for ease of use in child components.
  set(ctx, 'tabCustomData.AuthUserInfo', AuthUserInfo)

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return {
    pageProps,
    AuthUserInfo,
  }
}

App.propTypes = {
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
  }).isRequired,
  Component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object,
}

App.defaultProps = {
  pageProps: {},
}

export default App

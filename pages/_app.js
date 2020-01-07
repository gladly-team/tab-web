/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { get, set } from 'lodash/object'
import { UserContext, useAuth } from '../utils/auth/hooks'
import { createAuthUser } from '../utils/auth/user'
import { addSession } from '../utils/middleware/cookieSession'
import { isServerSide } from '../utils/ssr'

const App = props => {
  const { authUserFromSession, authUserToken, Component, pageProps } = props

  // We'll use the authed user from client-side auth (Firebase JS SDK)
  // when available. On the server side, we'll use the authed user from
  // the session. This allows us to server-render while also using Firebase's
  // client-side auth functionality.
  // Note: we need to destroy the session when logging out with the Firebase
  // JS SDK.
  const { user: authUserFromClient } = useAuth()
  console.log('_app.js authUserFromClient', authUserFromClient)
  const authUser =
    createAuthUser(authUserFromClient) || authUserFromSession || null

  return (
    <UserContext.Provider value={authUser}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { req, res } = ctx

  // Add session info to the request.
  if (isServerSide()) {
    addSession(req, res)
  }

  // Get the user and user token from the session.
  const authUserFromSession = createAuthUser(
    get(req, 'session.decodedToken', null)
  )
  const authUserToken = get(req, 'session.token', null)

  // Explicitly add the user to a custom prop in the getInitialProps
  // context for ease of use.
  set(ctx, 'tabCustomData.authUser', authUserFromSession)
  set(ctx, 'tabCustomData.authUserToken', authUserToken)
  console.log('_app.js authUserFromSession', authUserFromSession)

  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return {
    pageProps,
    authUserFromSession,
    authUserToken,
  }
}

App.propTypes = {
  authUserFromSession: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    emailVerified: PropTypes.bool.isRequired,
  }),
  authUserToken: PropTypes.string,
  Component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object,
}

App.defaultProps = {
  authUserFromSession: null,
  authUserToken: null,
  pageProps: {},
}

export default App

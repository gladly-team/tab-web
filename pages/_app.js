/* eslint react/jsx-props-no-spreading: 0 */
/* globals window */
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
  const authUser =
    createAuthUser(authUserFromClient) || authUserFromSession || null

  return (
    <UserContext.Provider value={{ user: authUser, userToken: authUserToken }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { req, res } = ctx

  // Get the AuthUser object and token.
  let authUserFromSession = null
  let authUserToken = null
  if (isServerSide()) {
    // If server-side, get session info from the request.
    addSession(req, res)
    authUserFromSession = createAuthUser(get(req, 'session.decodedToken', null))
    authUserToken = get(req, 'session.token', null)
  } else {
    // If client-side, get the auth info from stored data. We store it
    // in _document.js. See:
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    try {
      const sessionInfo = JSON.parse(
        window.document.getElementById('__TAB_WEB_AUTH_INFO').textContent
      )
      ;({ authUserFromSession, authUserToken } = sessionInfo)
    } catch (e) {
      // TODO: log error
      console.error(e) // eslint-disable-line no-console
    }
  }

  // Explicitly add the user to a custom prop in the getInitialProps
  // context for ease of use in child components.
  set(ctx, 'tabCustomData.authUser', authUserFromSession)
  set(ctx, 'tabCustomData.authUserToken', authUserToken)

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

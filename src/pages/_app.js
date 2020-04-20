/* globals document */
/* eslint react/jsx-props-no-spreading: 0 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { get, set } from 'lodash/object'
import { register, unregister } from 'next-offline/runtime'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { AuthUserInfoContext, useFirebaseAuth } from 'src/utils/auth/hooks'
import {
  createAuthUser,
  createAuthUserInfo,
  getAuthUserInfoFromDOM,
} from 'src/utils/auth/user'
import { withSession } from 'src/utils/middleware/session'
import { isClientSide, isServerSide } from 'src/utils/ssr'
import {
  NEXT_CTX_CUSTOM_DATA_KEY,
  NEXT_CTX_AUTH_USER_INFO_KEY,
  REQ_SESSION_KEY,
  REQ_SESSION_AUTH_USER_INFO_KEY,
} from 'src/utils/constants'
import theme from 'src/utils/theme'

const App = props => {
  const { AuthUserInfo, Component, pageProps } = props

  // Optionally, enable or disable the service worker:
  // https://github.com/hanford/next-offline#runtime-registration
  useEffect(() => {
    const isServiceWorkerEnabled = process.env.SERVICE_WORKER_ENABLED === 'true'
    if (isClientSide()) {
      if (isServiceWorkerEnabled) {
        register('/newtab/service-worker.js')
        console.log('Registered the service worker.') // eslint-disable-line no-console
      } else {
        unregister()
        console.log('Not registering a service worker. It is not enabled.') // eslint-disable-line no-console
      }
    }
    return () => {
      if (isClientSide() && isServiceWorkerEnabled) {
        unregister()
        console.log('Unregistered the service worker.') // eslint-disable-line no-console
      }
    }
  }, [])

  useEffect(() => {
    // Material UI:
    // Remove the server-side injected CSS.
    // https://github.com/mui-org/material-ui/tree/master/examples/nextjs
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  // We'll use the authed user from client-side auth (Firebase JS SDK)
  // when available. On the server side, we'll use the authed user from
  // the session. This allows us to server-render while also using Firebase's
  // client-side auth functionality.
  // Note: we need to destroy the session when logging out with the Firebase
  // JS SDK. We also need to destroy the "__TAB_WEB_AUTH_USER_INFO" script.
  const { initializing, user: firebaseUser } = useFirebaseAuth()
  const AuthUserFromClient = createAuthUser(firebaseUser)
  const { AuthUser: AuthUserFromSession, token } = AuthUserInfo

  // We rely on this AuthUser value to, among other things, determine whether
  // to redirect to/from the authentication page.
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
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* Material UI: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthUserInfoContext.Provider value={{ AuthUser, token }}>
          <Component {...pageProps} />
        </AuthUserInfoContext.Provider>
      </ThemeProvider>
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  const { req, res } = ctx

  // Get the AuthUserInfo object.
  let AuthUserInfo
  if (isServerSide()) {
    // If server-side, get AuthUserInfo from the session in the request.
    withSession(req, res)

    // If AuthUserInfo isn't in the session, default to an empty
    // AuthUserInfo object.
    AuthUserInfo = get(
      req,
      [REQ_SESSION_KEY, REQ_SESSION_AUTH_USER_INFO_KEY],
      createAuthUserInfo()
    )
  } else {
    // If client-side, get AuthUserInfo from stored data. We store it
    // in _document.js. See:
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    AuthUserInfo = getAuthUserInfoFromDOM()
  }

  // Explicitly add the user to a custom prop in the getInitialProps
  // context for ease of use in child components.
  set(
    ctx,
    [NEXT_CTX_CUSTOM_DATA_KEY, NEXT_CTX_AUTH_USER_INFO_KEY],
    AuthUserInfo
  )

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

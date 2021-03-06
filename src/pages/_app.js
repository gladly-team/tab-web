/* globals document */
/* eslint react/jsx-props-no-spreading: 0 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Router from 'next/router'
import { register, unregister } from 'next-offline/runtime'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { isClientSide } from 'src/utils/ssr'
import theme from 'src/utils/theme'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import initAuth from 'src/utils/auth/initAuth'
import initSentry from 'src/utils/initSentry'
import ErrorBoundary from 'src/components/ErrorBoundary'
import initializeCMP from 'src/utils/initializeCMP'
import { setWindowLocation } from 'src/utils/navigation'
import 'src/utils/styles/globalStyles.css'

initAuth()

// https://github.com/vercel/next.js/blob/canary/examples/with-sentry-simple/pages/_app.js
initSentry()

// We use Tab Legacy for authentication logic, so we should override
// any routing to the auth page to force a hard navigation rather
// than navigating within this app.
// Remove when we want to use this app for auth. See:
// https://github.com/gladly-team/tab/pull/891
// Router override workarounds:
// https://github.com/vercel/next.js/discussions/12348#discussioncomment-8089
// https://github.com/vercel/next.js/issues/2476
Router.events.on('routeChangeStart', (route) => {
  const isAuthPage = route.includes('/newtab/auth/')
  if (isAuthPage) {
    // Cancel routeChange event by erroring. See:
    // https://github.com/zeit/next.js/issues/2476
    Router.events.emit('routeChangeError')
    setWindowLocation(route, { addBasePath: false })
    throw new Error(
      `routeChange aborted. This error can be safely ignored. See: https://github.com/zeit/next.js/issues/2476.`
    )
  }
})

try {
  ensureValuesAreDefined(process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED)
} catch (e) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_SERVICE_WORKER_ENABLED must be set.'
  )
}

// Initialize the CMP.
// Delaying the CMP initialization avoids delaying any CMP
// responses needed for our ad partner bid requests.
// Our modified CMP API stubs are quick to respond, but the
// core CMP JS, which replaces the stubs and is out of our
// control, may be slower to respond.
// Note that because we delay CMP initialization by default,
// any pages that rely on other CMP methods, such as the
// account page, should initialize the CMP before calling
// those methods.
if (isClientSide()) {
  const initCMP = () => {
    initializeCMP()
  }
  setTimeout(initCMP, 1500)
}

const MyApp = (props) => {
  const { Component, pageProps } = props

  // Optionally, enable or disable the service worker:
  // https://github.com/hanford/next-offline#runtime-registration
  useEffect(() => {
    const isServiceWorkerEnabled =
      process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === 'true'
    if (isClientSide()) {
      if (isServiceWorkerEnabled) {
        register('/newtab/service-worker.js')
        console.log('Registered the service worker.') // eslint-disable-line no-console
      } else {
        unregister()
        console.log('Not registering a service worker. It is not enabled.') // eslint-disable-line no-console
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

  return (
    <>
      <Head>
        <title>Tab for a Cause</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </ThemeProvider>
    </>
  )
}

MyApp.displayName = 'App'

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object,
}

MyApp.defaultProps = {
  pageProps: {},
}

export default MyApp

/* globals document */
/* eslint react/jsx-props-no-spreading: 0 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { register, unregister } from 'next-offline/runtime'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { isClientSide } from 'src/utils/ssr'
import theme from 'src/utils/theme'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import initAuth from 'src/utils/auth/initAuth'
import initSentry from 'src/utils/initSentry'
import ErrorBoundary from 'src/components/ErrorBoundary'

initAuth()

// https://github.com/vercel/next.js/blob/canary/examples/with-sentry-simple/pages/_app.js
initSentry()

try {
  ensureValuesAreDefined(process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED)
} catch (e) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_SERVICE_WORKER_ENABLED must be set.'
  )
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

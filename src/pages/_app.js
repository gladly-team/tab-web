/* globals document */
/* eslint react/jsx-props-no-spreading: 0 */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import { register, unregister } from 'next-offline/runtime'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import uuid from 'uuid/v4'
import { isClientSide } from 'src/utils/ssr'
import theme from 'src/utils/theme'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import initAuth from 'src/utils/auth/initAuth'
import initSentry from 'src/utils/initSentry'

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
  const { Component, pageProps, err } = props
  const [tabId] = useState(uuid())
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

  // FIXME: move Sentry into its own HOC. Make sure we set Sentry
  //   context in APIs (server-side) as well as during component
  //   rendering on both client and server. `initSentry` from
  //   API functions, too. Clean up and consolidate Sentry logic
  //   for reuse.
  // Set user context for Sentry error logging.
  // const { id: userId, email } = AuthUser || {}
  // useEffect(() => {
  //   if (userId) {
  //     Sentry.setUser({ id: userId, email })
  //   }
  // }, [userId, email])

  // Including the "err" prop as a workaround for:
  // https://github.com/vercel/next.js/issues/8592
  // See:
  // https://github.com/vercel/next.js/tree/canary/examples/with-sentry
  return (
    <>
      <Head>
        <title>Tab for a Cause</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* Material UI: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} tabId={tabId} err={err} />
      </ThemeProvider>
    </>
  )
}

MyApp.displayName = 'App'

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  err: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object,
}

MyApp.defaultProps = {
  err: undefined,
  pageProps: {},
}

export default MyApp

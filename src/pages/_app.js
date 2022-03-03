/* globals document, window */
/* eslint react/jsx-props-no-spreading: 0 */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Router from 'next/router'
import { register, unregister } from 'next-offline/runtime'

import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { isClientSide } from 'src/utils/ssr'

import defaultTheme from 'src/utils/theme'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import initAuth from 'src/utils/auth/initAuth'
import initSentry from 'src/utils/initSentry'
import ErrorBoundary from 'src/components/ErrorBoundary'
import initializeCMP from 'src/utils/initializeCMP'
import { setWindowLocation } from 'src/utils/navigation'
import isOurHost from 'src/utils/isOurHost'
import 'src/utils/styles/globalStyles.css'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react'
import features from 'src/features/features.json'
import { trackingCallback } from 'src/utils/growthbook'

initAuth()

// https://github.com/vercel/next.js/blob/canary/examples/with-sentry-simple/pages/_app.js
initSentry()

// @workaround/separate-auth-app
// We use Tab Legacy for authentication logic, so we should override
// any routing to the auth page to force a hard navigation rather
// than navigating within this app.
// Remove when we want to use this app for auth. See:
// https://github.com/gladly-team/tab/pull/891
// Router override workarounds:
// https://github.com/vercel/next.js/discussions/12348#discussioncomment-8089
// https://github.com/vercel/next.js/issues/2476
Router.events.on('routeChangeStart', (route) => {
  // Only redirect if running on our domain, which is when
  // the auth app will exist. Otherwise, this will redirect
  // in an infinite loop.
  if (isClientSide() && isOurHost(window.location.hostname)) {
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

// The MUI theme prior to any user-level customization.
const standardTheme = createTheme(defaultTheme)

// Context for designing GrowthBook features: https://docs.google.com/document/d/1ru-oO7-OWVM3ByYZseJBQ-Mu8_1LwcLUMNlHdpQ2JN4/edit#heading=h.5qxtlklvlhrs
// When adding a new experiment, design it so that the weights of the experiment should be constant.
// For example to design an experiment and modify experiment, we can:
//  - Run an experiment over x% of traffic (e.g. a 50/50 exp over 10% of traffic)
//  - Adjust the percentage of traffic the experiment is run over. This allows us to scale the total amount of traffic going to a particular bucket.
const growthbook = new GrowthBook({
  trackingCallback,
})
growthbook.setFeatures(features)

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
      <GrowthBookProvider growthbook={growthbook}>
        <ThemeProvider theme={standardTheme}>
          <CssBaseline />
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </ThemeProvider>
      </GrowthBookProvider>
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

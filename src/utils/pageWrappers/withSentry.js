import React, { useEffect } from 'react'
import { useAuthUser } from 'next-firebase-auth'
import * as Sentry from '@sentry/node'

// Our Webpack config swaps in the browser Sentry package when in
// a browser environment. See this example:
// https://github.com/vercel/next.js/blob/canary/examples/with-sentry/next.config.js#L45

// This HOC should be wrapped in `withAuthUser`.
// A component wrapper that sets the sentry user at each page
export const withSentry = (ChildComponent) => {
  const WithSentryHOC = (props) => {
    const AuthUser = useAuthUser()

    // Set user context for Sentry error logging.
    const { id: userId, email } = AuthUser || {}
    useEffect(() => {
      if (userId) {
        Sentry.setUser({ id: userId, email })
      }
    }, [userId, email])
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    return <ChildComponent {...props} />
  }

  WithSentryHOC.displayName = 'WithSentryHOC'
  return WithSentryHOC
}

// This HOC should be wrapped in `withAuthUserSSR`.
// A wrapper for `getServerSideProps` that sets the sentry user.
export const withSentrySSR = (getServerSidePropsFunc) => async (ctx) => {
  const { AuthUser } = ctx

  // set auth user in sentry
  const { id: userId, email } = AuthUser || {}
  if (userId) {
    Sentry.setUser({ id: userId, email })
  }

  // Get composed props.
  let composedProps = {}
  if (getServerSidePropsFunc) {
    composedProps = await getServerSidePropsFunc(ctx)
  }
  return composedProps
}

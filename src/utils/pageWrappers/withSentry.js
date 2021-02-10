// This HOC should be wrapped in `withAuthUser`.

import React, { useEffect } from 'react'
import { useAuthUser } from 'next-firebase-auth'
import * as Sentry from '@sentry/node'
import initSentry from 'src/utils/initSentry'
import logger from 'src/utils/logger'

initSentry()
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

export const topLevelCatchBoundary = (getServerSidePropsFunc) => async (
  ctx
) => {
  let composedProps = { props: {} }
  try {
    if (getServerSidePropsFunc) {
      composedProps = await getServerSidePropsFunc(ctx)
    }
  } catch (e) {
    logger.error(e)
  }
  return composedProps
}

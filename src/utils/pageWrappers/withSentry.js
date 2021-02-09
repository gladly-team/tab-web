// This HOC should be wrapped in `withAuthUser`.

import React, { useEffect } from 'react'
import { useAuthUser } from 'next-firebase-auth'
import * as SentryBrowser from '@sentry/browser'
import * as SentryServer from '@sentry/node'

export const withSentry = (ChildComponent) => {
  const WithSentryHOC = (props) => {
    const AuthUser = useAuthUser()
    // Set user context for Sentry error logging.
    const { id: userId, email } = AuthUser || {}
    useEffect(() => {
      if (userId) {
        SentryBrowser.setUser({ id: userId, email })
      }
    }, [userId, email])
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    return <ChildComponent {...props} />
  }

  WithSentryHOC.displayName = 'WithSentryHOC'
  return WithSentryHOC
}
// A wrapper for `getServerSideProps` that fetches data
// from our GraphQL endpoint.
/*
 * The `getRelayQuery` argument is a function:
 *   @param {Object} input
 *   @param {Object} input.AuthUser - An instance of an AuthUser
 *     from `next-firebase-auth`.
 *   @return {Object} queryInfo
 *   @return {Object} queryInfo.query - A GraphQLTaggedNode, the
 *     GraphQL query in a react-relay `graphql` template tag
 *   @return {Object} queryInfo.variables - Any variables to
 *     provide to the query.
 *
 */
export const withSentrySSR = (getServerSidePropsFunc) => async (ctx) => {
  const { AuthUser } = ctx
  //   console.log(getServerSidePropsFunc, ctx, 'gsspf','ctx')
  console.log(AuthUser, 'auth user?')
  //set auth user in sentry
  const { id: userId, email } = AuthUser || {}
  if (userId) {
    SentryServer.setUser({ id: userId, email })
  }

  // Get composed props.
  let composedProps = {}
  if (getServerSidePropsFunc) {
    composedProps = await getServerSidePropsFunc(ctx)
  }

  return {
    ...composedProps,
    // nothing added, just adjusted sentry context
  }
}

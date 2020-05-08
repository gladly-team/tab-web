/* eslint react/jsx-props-no-spreading: 0 */

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from 'src/utils/createRelayEnvironment'
import { useAuthUserInfo } from 'src/utils/auth/hooks'
import usePrevious from 'src/utils/hooks/usePrevious'
import useUpdateEffect from 'src/utils/hooks/useUpdateEffect'
import { isClientSide } from 'src/utils/ssr'
import {
  NEXT_CTX_CUSTOM_DATA_KEY,
  NEXT_CTX_AUTH_USER_INFO_KEY,
} from 'src/utils/constants'

// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

// TODO: add tests

export default (getRelayQuery) => (ComposedComponent) => {
  const WithDataComp = (props) => {
    const {
      queryRecords,
      queryProps,
      refetchDataOnMount,
      ...otherProps
    } = props

    // Get the AuthUser from context.
    const { AuthUser, token } = useAuthUserInfo()

    // Create the Relay environment.
    const [environment, setEnvironment] = useState(
      initEnvironment({
        records: queryRecords,
        token,
      })
    )

    // TODO: test
    // If the user's auth status changes after mount, recreate
    // the Relay environment so it doesn't use an outdated
    // Authorization header.
    const previousToken = usePrevious(token)
    useUpdateEffect(() => {
      // Don't update if the token hasn't changed.
      if (token === previousToken) {
        return
      }
      setEnvironment(
        initEnvironment({
          destroyExisting: true, // overwrite the current environment
          records: queryRecords,
          token,
        })
      )
    }, [queryRecords, token, previousToken])

    // Get the Relay query and variables from the wrapped component.
    // We pass the AuthUser so the child component can use the user
    // ID in the query, if needed.
    const { query, variables = {} } = getRelayQuery({ AuthUser })

    const [relayData, updateRelayData] = useState(queryProps)

    // If needed, refetch data on client-side mount.
    // If our service worker is active, we're likely loading stale data
    // from cached page HTML. In this case, refetch data on mount.
    useEffect(() => {
      if (!refetchDataOnMount) {
        return
      }
      let isCancelled = false
      const refetchData = async () => {
        if (isClientSide()) {
          const newRelayData = await fetchQuery(environment, query, variables)
          if (!isCancelled) {
            updateRelayData(newRelayData)
          }
        }
      }
      refetchData()

      // Prevent state updates on unmount. We might also want to use
      // AbortController. See:
      // https://dev.to/pallymore/clean-up-async-requests-in-useeffect-hooks-90h
      // eslint-disable-next-line consistent-return
      return () => {
        isCancelled = true
      }

      // FIXME: do this the right way.
      // We want to refetch only once on mount.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // The child component's props are the combination of any initial props it
    // requested plus data fetched via Relay.
    const componentData = {
      ...otherProps,
      ...relayData,
    }

    return (
      <ReactRelayContext.Provider value={{ environment, variables }}>
        <ComposedComponent {...componentData} />
      </ReactRelayContext.Provider>
    )
  }

  WithDataComp.getInitialProps = async (ctx) => {
    // Get the AuthUserInfo object. This is set in _app.js.
    const AuthUserInfo = get(
      ctx,
      [NEXT_CTX_CUSTOM_DATA_KEY, NEXT_CTX_AUTH_USER_INFO_KEY],
      null
    )
    const AuthUser = get(AuthUserInfo, 'AuthUser', null)
    const AuthUserToken = get(AuthUserInfo, 'token', null)

    // Evaluate the composed component's getInitialProps().
    let composedInitialProps = {}
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    // Create the Relay environment.
    const environment = initEnvironment({
      token: AuthUserToken,
    })

    // Get the Relay query and variables config. We pass the authUser
    // so the child component can use the user ID in the query, if needed.
    const { query, variables = {} } = getRelayQuery({ AuthUser })

    // If there is a query, fetch the results.
    let queryProps = {}
    let queryRecords = {}
    if (query) {
      // TODO: Consider RelayQueryResponseCache
      // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
      queryProps = await fetchQuery(environment, query, variables)
      queryRecords = environment.getStore().getSource().toJSON()
    }

    // Determine if we should refetch data on client-side mount.
    // If we aren't running the service worker, there's no reason to refetch.
    // In addition, if getInitialProps is called on the client side,
    // like during client-side navigation, we don't need to refetch.
    const refetchDataOnMount =
      process.env.SERVICE_WORKER_ENABLED === 'true' && !isClientSide()

    return {
      ...composedInitialProps,
      queryProps,
      queryRecords,
      refetchDataOnMount,
    }
  }

  WithDataComp.displayName = `WithData(${ComposedComponent.displayName})`

  WithDataComp.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    queryProps: PropTypes.object.isRequired,
    refetchDataOnMount: PropTypes.bool.isRequired,
  }

  WithDataComp.defaultProps = {}

  return WithDataComp
}

// This HOC should be wrapped in `withRelay` and `withAuthUser`.`

import { useEffect, useState } from 'react'
import useSWR from 'swr'

// TODO: migrate to the new observable fetchQuery:
// https://github.com/facebook/relay/releases/tag/v11.0.0
// Unclear if SWR has observable/subscribe support.
import { fetchQuery_DEPRECATED as fetchQuery } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import {
  getRelayEnvironment,
  waitForAuthInitialized,
} from 'src/utils/relayEnvironment'

const fetcher = async (query, variables) => {
  // Make sure the Relay environment has a valid ID token.
  await waitForAuthInitialized()
  const environment = getRelayEnvironment()
  return fetchQuery(environment, JSON.parse(query), JSON.parse(variables))
}

const useData = ({ getRelayQuery, fallbackData, ...SWROptions }) => {
  // Before fetching data, wait for the AuthUser to initialize
  // if it's not not already available.
  const AuthUser = useAuthUser()
  if (!AuthUser) {
    throw new Error(
      'The `useData` HOC should be wrapped in the `withAuthUser` HOC.'
    )
  }
  const [isAuthReady, setIsAuthReady] = useState(false)
  useEffect(() => {
    // We need the authentication client to have initialized before
    // fetching any data so we can be sure the Relay environment will
    // use an unexpired user ID token. (When a SSR page is loaded from
    // browser cache, the AuthUser may be defined but have an expired
    // token value.)
    if (AuthUser.clientInitialized) {
      setIsAuthReady(true)
    }
  }, [AuthUser])

  // Get the Relay query.
  const [relayInfo, setRelayInfo] = useState({
    query: null,
    variables: {},
  })
  useEffect(() => {
    const getRelayQueryAndVars = async () => {
      const { query, variables = {} } = await getRelayQuery({ AuthUser })
      setRelayInfo({
        query,
        variables,
      })
    }
    if (isAuthReady) {
      getRelayQueryAndVars()
    }
  }, [isAuthReady, AuthUser, getRelayQuery])
  const { query: relayQuery, variables: relayVariables } = relayInfo

  const readyToFetch = !!relayQuery

  // TODO: may want to cancel requests, like when a page unmounts.
  // https://github.com/vercel/swr/issues/129

  // If revalidateOnMount is true, assume data is stale, most likely due
  // to the service worker.
  const { revalidateOnMount } = SWROptions
  const [isDataFresh, setIsDataFresh] = useState(!revalidateOnMount)

  // https://github.com/vercel/swr#options
  // SWR won't fetch if the "key" function returns null.
  // https://github.com/vercel/swr#dependent-fetching
  // SWR will refetch if any of these arguments change.
  const { data, error } = useSWR(
    () =>
      !readyToFetch
        ? null
        : [JSON.stringify(relayQuery), JSON.stringify(relayVariables)],
    fetcher,
    {
      fallbackData,
      revalidateOnMount,
      ...SWROptions,
      onSuccess: (freshData) => {
        // TODO: remove
        // eslint-disable-next-line no-console
        console.log('SWR onSuccess', freshData)
        setIsDataFresh(true)
      },
      onError: () => {
        setIsDataFresh(true)
      },
    }
  )

  return {
    data,
    error,
    isDataFresh,
  }
}

export default useData

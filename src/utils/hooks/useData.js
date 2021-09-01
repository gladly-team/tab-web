// This HOC should be wrapped in `withRelay` and `withAuthUser`.`

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetchQuery } from 'react-relay'
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

const useData = ({ getRelayQuery, initialData, ...SWROptions }) => {
  // Before fetching data, wait for the AuthUser to initialize
  // if it's not not already available.
  const AuthUser = useAuthUser()
  console.log(AuthUser)
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
      initialData,
      ...SWROptions,
    }
  )

  console.log(data)
  console.log(error)
  return {
    data,
    error,
  }
}

export default useData

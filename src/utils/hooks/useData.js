// This HOC should be wrapped in `withRelay` and `withAuthUser`.`

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetchQuery } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import { getRelayEnvironment } from 'src/utils/relayEnvironment'

const fetcher = async (query, variables) => {
  const environment = getRelayEnvironment()
  return fetchQuery(environment, JSON.parse(query), JSON.parse(variables))
}

const useData = ({ getRelayQuery, initialData, ...SWROptions }) => {
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
    if (AuthUser.clientInitialized) {
      setIsAuthReady(true)
    }
  }, [AuthUser])

  // Set up the Relay environment and get the Relay query.
  const [relayQuery, setRelayQuery] = useState()
  const [relayVariables, setRelayVariables] = useState()
  useEffect(() => {
    const getRelayQueryAndVars = async () => {
      const { query, variables = {} } = await getRelayQuery({ AuthUser })
      setRelayVariables(variables)
      setRelayQuery(query)
    }
    if (isAuthReady) {
      getRelayQueryAndVars()
    }
  }, [isAuthReady, AuthUser, getRelayQuery, initialData])

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

  return {
    data,
    error,
  }
}

export default useData

// This HOC should be wrapped in `withRelay` and `withAuthUser`.`

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetchQuery } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import { getRelayEnvironment } from 'src/utils/relayEnvironment'

const fetcher = async (query, variables) => {
  const environment = getRelayEnvironment()
  return fetchQuery(environment, query, variables)
}

const useData = ({ getRelayQuery, initialData }) => {
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
    if (AuthUser.id || AuthUser.clientInitialized) {
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

  // TODO: handle smart refetching. Pass ...rest of props directly
  // to SWR.
  // Can use SWR's "revalidateOnMount" option:
  //   https://github.com/vercel/swr#options
  // Determine if we should refetch data on client-side mount.
  // If we aren't running the service worker, there's no reason to refetch.
  // const refetchDataOnMount =
  //   process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === 'true'

  // TODO: may want to cancel requests, like when a page unmounts.
  // https://github.com/vercel/swr/issues/129

  // https://github.com/vercel/swr#options
  const { data, error } = useSWR(
    // SWR won't fetch if the "key" function returns null.
    // https://github.com/vercel/swr#dependent-fetching
    // SWR will refetch if any of these arguments change.
    () => (!readyToFetch ? null : [relayQuery, relayVariables]),
    fetcher,
    {
      initialData,
    }
  )

  return {
    data,
    error,
  }
}

export default useData

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetchQuery } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import { useRelayEnvironment } from 'src/utils/relayEnvironment'

// TODO:
// Goals:
// * The Relay query logic is shared with `withDataSSR`` but
//   this should work without any SSR and this should not be
//   dependent on `withDataSSR` at all
// * It should work without any AuthUser (no `withUser` HOC)
// * It should work with an unauthed AuthUser

const useData = ({ getRelayQuery, initialData }) => {
  // Wait for AuthUser to initialize and get the token.
  const AuthUser = useAuthUser()
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [token, setToken] = useState()
  useEffect(() => {
    const getUserToken = async () => {
      const userIdToken = await AuthUser.getIdToken()
      setToken(userIdToken)
      setIsAuthReady(true)
    }
    if (AuthUser.clientInitialized) {
      getUserToken()
    }
  }, [AuthUser])

  // Set up the Relay environment and get the Relay query.
  const [relayQuery, setRelayQuery] = useState()
  const [relayVariables, setRelayVariables] = useState()
  // const [relayEnvironment, setRelayEnvironment] = useState()
  useEffect(() => {
    const initRelay = async () => {
      const { query, variables = {} } = await getRelayQuery({ AuthUser })
      setRelayVariables(variables)
      setRelayQuery(query)
      // const environment = useRelayEnvironment({
      //   initialData,
      //   token,
      // })
      // setRelayEnvironment(environment)
    }
    if (AuthUser.clientInitialized) {
      initRelay()
    }
  }, [isAuthReady, token, AuthUser, getRelayQuery, initialData])

  const readyToFetch = !!relayQuery
  const relayEnvironment = useRelayEnvironment({
    initialData,
    token,
  })

  // TODO: handle smart refetching.
  // Can use SWR's "revalidateOnMount" option:
  //   https://github.com/vercel/swr#options
  // Determine if we should refetch data on client-side mount.
  // If we aren't running the service worker, there's no reason to refetch.
  // const refetchDataOnMount =
  //   process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === 'true'

  // SWR won't fetch if the "key" function return snull.
  // https://github.com/vercel/swr#dependent-fetching
  // const queryProps = await fetchQuery(environment, query, variables)
  const { data, error } = useSWR(
    () =>
      !readyToFetch ? null : [relayEnvironment, relayQuery, relayVariables],
    fetchQuery,
    {
      initialData,
    }
  )

  // https://github.com/vercel/swr#options
  return {
    data,
    error,
  }
}

export default useData

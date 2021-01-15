import { initRelayEnvironment } from 'src/utils/relayEnvironment'
import { fetchQuery } from 'react-relay'

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
 * The AuthUser is an instance of an AuthUser from
 * `next-firebase-auth`.
 */
const withDataSSR = (getRelayQuery, AuthUser) => (
  getServerSidePropsFunc
) => async (ctx) => {
  const token = await AuthUser.getIdToken()

  // Create the Relay environment.
  // We pass the AuthUser so the caller can use the user info
  // in the query, as needed.
  const { query, variables } = await getRelayQuery({ AuthUser })
  const environment = initRelayEnvironment({
    token,
  })

  // Fetch the Relay data.
  let queryProps = {}
  let initialRecords = {}
  if (query) {
    queryProps = await fetchQuery(environment, query, variables)
    initialRecords = environment.getStore().getSource().toJSON()
  }

  // Gete composed props.
  let composedProps = {}
  if (getServerSidePropsFunc) {
    composedProps = await getServerSidePropsFunc(ctx)
  }
  return {
    // TODO: possibly namespace these so there aren't conflicts
    //   and use a HOC to manage props.
    ...composedProps,
    ...queryProps,
    initialRecords,
  }
}

export default withDataSSR

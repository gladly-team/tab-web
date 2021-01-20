import { isEmpty } from 'lodash/lang'
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
 */
const withDataSSR = (getRelayQuery) => (getServerSidePropsFunc) => async (
  ctx
) => {
  const { AuthUser } = ctx

  // Create the Relay query. We pass the AuthUser so the caller
  // can use the user info in the query, as needed.
  const { query, variables } = await getRelayQuery({ AuthUser })

  // Create the Relay environment.
  const environment = initRelayEnvironment({
    getIdToken: AuthUser.getIdToken,
  })

  // Fetch the Relay data.
  let queryProps = {}
  let initialRecords = {}
  if (query) {
    const queryPropsRaw = await fetchQuery(environment, query, variables)

    // Workaround to remove `undefined` values, which Next.js
    // cannot serialize:
    // https://github.com/vercel/next.js/discussions/11209#discussioncomment-35915
    queryProps = JSON.parse(JSON.stringify(queryPropsRaw))
    initialRecords = environment.getStore().getSource().toJSON()
  }

  // Get composed props.
  let composedProps = {}
  if (getServerSidePropsFunc) {
    composedProps = await getServerSidePropsFunc(ctx)
  }

  return {
    // TODO: put in a "props" key when next-firebase-auth modifies
    //   its composition.
    // TODO: possibly namespace these so there aren't conflicts
    //   and use a HOC to manage props.
    ...composedProps,
    // If we don't fetch data, it should be null so that SWR will
    // fetch data on the client side (in `useData`).
    data: isEmpty(queryProps)
      ? null
      : {
          ...queryProps,
        },
    // The "initialRecords" prop is consumed by the `withRelay` HOC.
    initialRecords,
  }
}

export default withDataSSR

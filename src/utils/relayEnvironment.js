// Adapted from:
// https://github.com/vercel/next.js/blob/canary/examples/with-relay-modern/lib/relay.js

import { useMemo } from 'react'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { isServerSide } from 'src/utils/ssr'
import logger from 'src/utils/logger'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'

try {
  ensureValuesAreDefined(process.env.NEXT_PUBLIC_RELAY_ENDPOINT)
} catch (e) {
  throw new Error(
    'Environment variable NEXT_PUBLIC_RELAY_ENDPOINT must be set.'
  )
}

const relayEndpoint = process.env.NEXT_PUBLIC_RELAY_ENDPOINT
let relayEnvironment = null

/**
 * Create the `fetch` function that serves as the network interface
 * for Relay fetches.
 * @param {Object} config
 * @param {String} config.token - The user's token to use in the Authorization
 *   header
 * @return {Function} A `fetch` call that returns a Promise and
 *   resolves into fetched data.
 */
const createFetchQuery = ({ token }) => {
  const fetchQuery = async (operation, variables) => {
    const response = await fetch(relayEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // If the user does not have a token, send a placeholder value.
        // We do this because AWS API Gateway's custom authorizers will
        // reject any request without a token and we want to provide
        // unauthenticated access to our API.
        // "If a specified identify source is missing, null, or empty,
        // API Gateway returns a 401 Unauthorized response without calling
        // the authorizer Lambda function.”
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/configure-api-gateway-lambda-authorization-with-console.html"
        Authorization: token || 'unauthenticated',
      },
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables,
      }),
    })
    const responseJSON = await response.json()

    // If the response is not a 200, throw.
    if (!response.ok) {
      throw new Error(`Bad GraphQL response. ${JSON.stringify(responseJSON)}`)
    }

    // If there are any errors returned from GraphQL, log them and throw.
    if (responseJSON.errors && responseJSON.errors) {
      responseJSON.errors.forEach((err) => {
        logger.error(err)
      })
      throw new Error(
        `Bad GraphQL response. Errors: ${JSON.stringify(responseJSON.errors)}`
      )
    }

    return responseJSON
  }
  return fetchQuery
}

/**
 * Create the Relay environment. On the server, this will always
 * return a new environment. On the client, this will typically
 * reuse the existing environment.
 * @param {Object} config
 * @param {String} config.records - The query records fetched from
 *   our API on the server-side before SSR or client rendering
 * @param {String} config.token - The user's token to use in the fetch
 *   Authorization header
 * @param {Boolean} config.throwIfNotPreviouslyCreated - If true,
 *   we will not create a new environment. Instead, if an environment
 *   does not already exist, throw an error.
 * @return {Object} A Relay environment
 */
export const initRelayEnvironment = ({
  records = {},
  token = null,
  throwIfNotPreviouslyCreated = false,
} = {}) => {
  const createNewEnvironment = () => {
    const network = Network.create(createFetchQuery({ token }))
    const store = new Store(new RecordSource(records))
    return new Environment({
      network,
      store,
    })
  }

  // On the server, always recreate the environment so that data
  // isn't shared between connections.
  if (isServerSide()) {
    return createNewEnvironment()
  }

  // Note: if the user's auth state changes, we will want to
  // recreate the Relay environment. For now, we rely on the fact
  // that login/logout refetches the app from the server.

  // On the client side, reuse the environment if it exists.
  // If the user's token changes, recreate the Relay environment
  // so it doesn't use an outdated Authorization header.
  if (relayEnvironment) {
    return relayEnvironment
  }

  // Some callers, such as mutations, expect the environment to already
  // exist and thus aren't providing the user token or records.
  if (throwIfNotPreviouslyCreated) {
    throw new Error(
      'The Relay environment was expected to have been already created but was not.'
    )
  }

  // Otherwise, create a new environment.
  relayEnvironment = createNewEnvironment()
  return relayEnvironment
}

// FIXME: we need to recreate the Relay environmnt when the
//   user's token value changes.
export const useRelayEnvironment = (args) => {
  const store = useMemo(() => initRelayEnvironment(args), [args])
  return store
}

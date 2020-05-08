// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/createRelayEnvironment.js

import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import fetch from 'isomorphic-unfetch'
import { isServerSide } from 'src/utils/ssr'

const relayEndpoint = process.env.RELAY_ENDPOINT
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
  function fetchQuery(operation, variables) {
    return fetch(relayEndpoint, {
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
    }).then((response) => response.json())
  }
  return fetchQuery
}

// FIXME: recreate the environment on login/logout

/**
 * Create the Relay environment. On the server, this will always
 * return a new environment. On the client, this will typically
 * reuse the existing environment.
 * @param {Object} config
 * @param {String} config.records - The query records fetched from
 *   our API on the server-side before SSR or client rendering
 * @param {String} config.token - The user's token to use in the fetch
 *   Authorization header
 * @return {Object} A Relay environment
 */
export default function initEnvironment({
  records = {},
  token = null,
  destroyExisting = false,
} = {}) {
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

  // On the client side, reuse the environment if it exists.
  if (relayEnvironment && !destroyExisting) {
    return relayEnvironment
  }

  // Otherwise, create a new one.
  relayEnvironment = createNewEnvironment()
  return relayEnvironment
}

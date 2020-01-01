// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/createRelayEnvironment.js

import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import fetch from 'isomorphic-unfetch'
import { isServerSide } from '../utils/ssr'

const relayEndpoint = process.env.RELAY_ENDPOINT
let relayEnvironment = null

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(operation, variables, { token = null }) {
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
  }).then(response => response.json())
}

export default function initEnvironment({ records = {} } = {}) {
  // Create a network layer from the fetch function
  const network = Network.create(fetchQuery)
  const store = new Store(new RecordSource(records))

  // Make sure to create a new Relay environment for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (isServerSide()) {
    return new Environment({
      network,
      store,
    })
  }

  // reuse Relay environment on client-side
  if (!relayEnvironment) {
    relayEnvironment = new Environment({
      network,
      store,
    })
  }

  return relayEnvironment
}

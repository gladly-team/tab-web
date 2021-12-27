// Adapted from:
// https://github.com/vercel/next.js/blob/canary/examples/with-relay-modern/lib/relay.js

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
  Auth service initialization
 */

// Manage whether the client-side authentication service has initialized.
// This lets us queue logic that needs to wait on auth initialization,
// such as mutations.

let isClientAuthInitialized = false

// A queue of resolvers for calls to `waitForAuthInitialized`.
let clientAuthInitResolvers = []

// Resolve all promises returned from `waitForAuthInitialized` and
// set future calls to immediately resolve.
const setClientAuthInitialized = () => {
  clientAuthInitResolvers.forEach((resolver) => resolver())
  isClientAuthInitialized = true
  clientAuthInitResolvers = []
}

/**
 * An async function that resolves when the client authentication
 *   service has initialized.
 * @return {Promise}
 */
export const waitForAuthInitialized = async () =>
  new Promise((resolve) => {
    // If client auth has initialized, resolve immediately.
    if (isClientAuthInitialized) {
      resolve()
      return
    }

    // Otherwise, queue the promise resolver for it to be called
    // when client auth initializes.
    clientAuthInitResolvers.push(resolve)
  })

/**
  End: auth service initialization
 */

/**
 * Create the `fetch` function that serves as the network interface
 * for Relay fetches.
 * @param {Object} config
 * @param {String} config.token - The user's token to use in the Authorization
 *   header
 * @return {Function} A `fetch` call that returns a Promise and
 *   resolves into fetched data.
 */
const createFetchQuery = ({ getIdToken }) => {
  const fetchQuery = async (operation, variables) => {
    // Debugging:
    // https://gladlyteam.atlassian.net/browse/TFAC-306
    // @workaround/expired-token-bug
    // Try fetching a fresh user and token when client side.
    let token
    if (isServerSide()) {
      token = await getIdToken()
    } else {
      // eslint-disable-next-line global-require
      const firebase = require('firebase/app').default
      // eslint-disable-next-line global-require
      require('firebase/auth')
      const { currentUser } = firebase.auth()
      if (currentUser) {
        token = await currentUser.getIdToken()
      }
    }

    const body = JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    })
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
      body,
    })
    const responseJSON = await response.json()

    // If the response is not a 200, throw.
    if (!response.ok) {
      throw new Error(
        `Bad GraphQL response. ${JSON.stringify(
          responseJSON
        )}. Query Body: ${body}`
      )
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

const createNewNetwork = (getIdToken) =>
  Network.create(createFetchQuery({ getIdToken }))

const createNewStore = (initialRecords = {}) =>
  new Store(new RecordSource(initialRecords))

const createEnvironment = ({ network, store }) =>
  new Environment({
    network,
    store,
  })

/**
 * Create the Relay environment. On the server, this will always
 * return a new environment. On the client, this will typically
 * reuse the existing environment.
 * @param {Object} config
 * @param {String} config.initialRecords - The query records fetched
 *   server-side before SSR or client rendering
 * @param {Function} config.getIdToken - A function that should
 *   return a valid user ID token for use in the Authorization
 *   header.
 * @param {Boolean} config.recreateNetwork - If true, returns a
 *   new Relay environment with a new network even when  a Relay
 *   environment already exists.
 * @param {Boolean} config.recreateStore - If true, returns a
 *   new Relay environment with a new store even when  a Relay
 *   environment already exists.
 * @return {Object} A Relay environment
 */
export const initRelayEnvironment = ({
  initialRecords,
  getIdToken = async () => null,
  recreateNetwork = false,
  recreateStore = false,
  publishInitialRecords = false,
  clientAuthInitialized = false,
} = {}) => {
  // On the server, always recreate the environment so that data
  // isn't shared between connections.
  if (isServerSide()) {
    return createEnvironment({
      network: createNewNetwork(getIdToken),
      store: createNewStore(initialRecords),
    })
  }

  // On the client side, if the environment needs to be
  // updated or doesn't exist, create a new environment.
  // Otherwise, use the existing environment.
  if (!relayEnvironment || recreateNetwork || recreateStore) {
    relayEnvironment = createEnvironment({
      network:
        recreateNetwork || !relayEnvironment
          ? createNewNetwork(getIdToken)
          : relayEnvironment.getNetwork(),
      store:
        recreateStore || !relayEnvironment
          ? createNewStore(initialRecords)
          : relayEnvironment.getStore(),
    })
  }

  // Add initial records to the environment. This is important
  // when client-side navigating to a page that expects new
  // data to exist in the store (e.g., loading our app on our account
  // page and closing the settings to nav to the new tab page.)
  // However, we should only call it when we know initialRecords
  // contain new and fresh data; otherwise, it may overwrite
  // existing state.
  // https://github.com/vercel/next.js/blob/canary/examples/with-relay-modern/lib/relay.js#L36
  if (initialRecords && publishInitialRecords) {
    relayEnvironment.getStore().publish(new RecordSource(initialRecords))
  }

  // As appropriate, set that the client authentication has initialized.
  // This needs to happen after Relay environment config above so that
  // the Relay environment is updated before we do any auth-dependent data
  // fetching.
  if (clientAuthInitialized) {
    setClientAuthInitialized()
  }

  return relayEnvironment
}

/**
 * Return the previously-created Relay environment. If the Relay
 * environment was not already created, throw an error.
 * @return {Object} A Relay environment
 */
export const getRelayEnvironment = () => {
  if (!relayEnvironment) {
    throw new Error(
      'The Relay environment was expected to have been already created but was not.'
    )
  }
  return relayEnvironment
}

import { commitMutation as commitMutationDefault } from 'react-relay'
import createRelayEnvironment from 'src/utils/createRelayEnvironment'

// TODO: throw if server-side
// TODO: add tests

// Return a Promise when committing mutations.
// https://github.com/facebook/relay/issues/1822#issuecomment-305906204
const commitMutation = (environment, options) => {
  return new Promise((resolve, reject) => {
    commitMutationDefault(environment, {
      ...options,
      onError: (error) => {
        reject(error)
      },
      onCompleted: (response) => {
        resolve(response)
      },
    })
  })
}

// https://relay.dev/docs/en/mutations#commitmutation
const createMutation = (mutationConfig) => {
  const { mutation, variables } = mutationConfig

  // We will reuse the Relay environment created earlier in the "withData"
  // HOC, which will include the user's token. This is a convenience so that
  // mutations don't have to provide authed user info. As a result, any
  // view that calls a mutation must be wrapped in the "withData" HOC.
  // If the Relay environment does not already exist, this will throw.
  // We can change this in the future, if needed; to do so, we need to pass
  // the AuthUserInfo to mutations here and provide the user token when
  // creating the Relay environment.
  const environment = createRelayEnvironment({
    throwIfNotPreviouslyCreated: true,
  })

  return commitMutation(environment, {
    mutation,
    variables,
  })
}

export default createMutation

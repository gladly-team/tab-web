import { commitMutation as commitMutationDefault } from 'react-relay'
import initEnvironment from 'src/utils/createRelayEnvironment'

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

  // TODO: throw if the env doesn't already exist?

  // This will reuse the environment created earlier in the
  // "withData" HOC, which will include the user's token.
  // This means any view that calls a mutation must be wrapped
  // in "withData".
  const environment = initEnvironment()

  return commitMutation(environment, {
    mutation,
    variables,
  })
}

export default createMutation

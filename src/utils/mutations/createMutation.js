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
  const environment = initEnvironment()
  return commitMutation(environment, {
    mutation,
    variables,
  })
}

export default createMutation

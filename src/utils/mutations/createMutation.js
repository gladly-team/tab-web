import commitMutation from 'relay-commit-mutation-promise'
import initEnvironment from 'src/utils/createRelayEnvironment'

// TODO: throw if server-side
// TODO: add tests

// This is a mutation constructor.
const createMutation = (mutationConfig) => {
  const { mutation, variables } = mutationConfig
  const environment = initEnvironment()
  return commitMutation(environment, {
    mutation,
    variables,
  })
}

export default createMutation

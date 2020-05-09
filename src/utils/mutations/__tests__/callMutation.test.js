import { commitMutation as commitMutationDefault } from 'react-relay'
import createRelayEnvironment from 'src/utils/createRelayEnvironment'

jest.mock('react-relay')
jest.mock('src/utils/createRelayEnvironment')

beforeEach(() => {
  commitMutationDefault.mockImplementation((environment, options) => {
    // Immediately call onCompleted.
    options.onCompleted({
      myMutation: {
        response: 'data',
      },
    })
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('callMutation', () => {
  it('calls createRelayEnvironment with the "throwIfNotPreviouslyCreated" option', async () => {
    expect.assertions(1)
    const callMutation = require('src/utils/mutations/callMutation').default
    await callMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
    })
    expect(createRelayEnvironment).toHaveBeenCalledWith({
      throwIfNotPreviouslyCreated: true,
    })
  })
})

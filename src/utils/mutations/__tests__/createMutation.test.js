import { commitMutation as commitMutationDefault } from 'react-relay'
import initEnvironment from 'src/utils/createRelayEnvironment'

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

describe('createMutation', () => {
  it('calls initEnvironment with the "throwIfNotPreviouslyCreated" option', async () => {
    expect.assertions(1)
    const createMutation = require('src/utils/mutations/createMutation').default
    await createMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
    })
    expect(initEnvironment).toHaveBeenCalledWith({
      throwIfNotPreviouslyCreated: true,
    })
  })
})

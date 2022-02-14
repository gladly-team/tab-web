import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

const getMockInput = () => ({
  userId: 'abc-123',
  source: 'ff',
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogSearchMutation', () => {
  it('calls callMutation with expected values', async () => {
    expect.assertions(1)
    const LogSearchMutation =
      require('src/utils/mutations/LogSearchMutation').default
    const args = getMockInput()
    await LogSearchMutation(args)
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: args,
      },
    })
  })
})

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

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const LogSearchMutation =
      require('src/utils/mutations/LogSearchMutation').default
    callMutation.mockResolvedValue({
      user: {
        id: 'some-id',
        searches: 100,
        searchesToday: 5,
      },
    })
    const response = await LogSearchMutation('some-user-id', 'some-tab-id')
    expect(response).toEqual({
      user: {
        id: 'some-id',
        searches: 100,
        searchesToday: 5,
      },
    })
  })
})

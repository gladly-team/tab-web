import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

const searchEngine = 'Google'
const userId = 'some-user-id'

describe('SetUserSearchEngineMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const SetUserSearchEngineMutation =
      require('src/utils/mutations/SetUserSearchEngineMutation').default
    await SetUserSearchEngineMutation(userId, searchEngine)
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId,
          searchEngine,
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const SetUserSearchEngineMutation =
      require('src/utils/mutations/SetUserSearchEngineMutation').default
    callMutation.mockResolvedValue({ hi: 'there' })
    const response = await SetUserSearchEngineMutation(userId, searchEngine)
    expect(response).toEqual({ hi: 'there' })
  })
})

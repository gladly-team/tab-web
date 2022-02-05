import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

const optIn = true
const userId = 'some-user-id'

describe('SetYahooSearchOptInMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const SetYahooSearchOptInMutation =
      require('src/utils/mutations/SetYahooSearchOptInMutation').default
    await SetYahooSearchOptInMutation(userId, optIn)
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId,
          optIn,
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const SetYahooSearchOptInMutation =
      require('src/utils/mutations/SetYahooSearchOptInMutation').default
    callMutation.mockResolvedValue({ hi: 'there' })
    const response = await SetYahooSearchOptInMutation(userId, optIn)
    expect(response).toEqual({ hi: 'there' })
  })
})

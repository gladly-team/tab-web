import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SetV4BetaMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const SetV4BetaMutation =
      require('src/utils/mutations/SetV4BetaMutation').default
    await SetV4BetaMutation({
      enabled: true,
      userId: 'some-user-id',
    })
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          enabled: true,
          userId: 'some-user-id',
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const SetV4BetaMutation =
      require('src/utils/mutations/SetV4BetaMutation').default
    callMutation.mockResolvedValue({ hi: 'there' })
    const response = await SetV4BetaMutation({
      enabled: true,
      userId: 'some-user-id',
    })
    expect(response).toEqual({ hi: 'there' })
  })
})

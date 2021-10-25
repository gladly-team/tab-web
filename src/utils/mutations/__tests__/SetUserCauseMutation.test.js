import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SetUserCauseMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const SetUserCauseMutation =
      require('src/utils/mutations/SetUserCauseMutation').default
    await SetUserCauseMutation({
      userId: 'some-user-id',
      causeId: 'someCauseId',
    })
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          causeId: 'someCauseId',
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const SetUserCauseMutation =
      require('src/utils/mutations/SetUserCauseMutation').default
    callMutation.mockResolvedValue({ hi: 'there' })
    const response = await SetUserCauseMutation({
      userId: 'some-user-id',
      causeId: 'someCauseId',
    })
    expect(response).toEqual({ hi: 'there' })
  })
})

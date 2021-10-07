import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SetHasSeenSquadsMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const SetHasSeenSquadsMutation =
      require('src/utils/mutations/SetHasSeenSquadsMutation').default
    await SetHasSeenSquadsMutation('some-user-id')
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const SetHasSeenSquadsMutation =
      require('src/utils/mutations/SetHasSeenSquadsMutation').default
    callMutation.mockResolvedValue({ hi: 'there' })
    const response = await SetHasSeenSquadsMutation('some-user-id')
    expect(response).toEqual({ hi: 'there' })
  })
})

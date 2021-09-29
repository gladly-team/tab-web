import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SquadInviteResponseMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const squadInviteResponseMutation =
      require('src/utils/mutations/SquadInviteResponseMutation').default
    await squadInviteResponseMutation('some-user-id', 'some-tab-id', true)
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          missionId: 'some-tab-id',
          accepted: true,
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const squadInviteResponseMutation =
      require('src/utils/mutations/SquadInviteResponseMutation').default
    callMutation.mockResolvedValue({
      success: true,
    })
    const response = await squadInviteResponseMutation(
      'some-user-id',
      'some-tab-id',
      true
    )
    expect(response).toEqual({
      success: true,
    })
  })
})

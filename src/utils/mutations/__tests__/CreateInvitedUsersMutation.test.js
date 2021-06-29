import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('CreateInvitedUsersMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const CreateInvitedUsersMutation = require('src/utils/mutations/CreateInvitedUsersMutation')
      .default
    await CreateInvitedUsersMutation(
      'some-user-id',
      ['bob@gmail.com'],
      'alec',
      'personal message'
    )
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          invitedEmails: ['bob@gmail.com'],
          inviterId: 'some-user-id',
          inviterMessage: 'personal message',
          inviterName: 'alec',
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const CreateInvitedUsersMutation = require('src/utils/mutations/CreateInvitedUsersMutation')
      .default
    callMutation.mockResolvedValue({
      successfulEmailAddresses: { email: ['bob@gmail.com'] },
      failedEmailAddresses: { email: [] },
    })
    const response = await CreateInvitedUsersMutation(
      'some-user-id',
      ['bob@gmail.com'],
      'alec',
      'personal message'
    )
    expect(response).toEqual({
      successfulEmailAddresses: { email: ['bob@gmail.com'] },
      failedEmailAddresses: { email: [] },
    })
  })
})

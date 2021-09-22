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
    const CreateSquadInvitesMutation =
      require('src/utils/mutations/CreateSquadInvitesMutation').default
    await CreateSquadInvitesMutation(
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
    const CreateSquadInvitesMutation =
      require('src/utils/mutations/CreateSquadInvitesMutation').default
    callMutation.mockResolvedValue({
      currentMission: {
        squadName: 'TestSquad',
        started: '2017-07-11T03:05:12Z',
        completed: null,
        missionId: '123456789',
        status: 'started',
        tabGoal: 1000,
        tabCount: 900,
        squadMembers: [
          {
            username: 'kevin',
            invitedEmail: null,
            status: 'accepted',
            tabs: 66,
          },
          {
            username: 'alec',
            invitedEmail: null,
            status: 'accepted',
            tabs: 834,
          },
          {
            username: null,
            invitedEmail: 'alec+897234@tabforacause.org',
            status: 'pending',
            tabs: 0,
          },
          {
            username: null,
            invitedEmail: 'alec+1s@tabforacause.org',
            status: 'pending',
            tabs: 0,
          },
        ],
        endOfMissionAwards: [
          { user: 'abcdefghijklmno', awardType: 'Consistent Kitty', unit: 6 },
          { user: 'omnlkjihgfedcba', awardType: 'Hot Paws', unit: 20 },
          {
            user: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
            awardType: 'All-Star Fur Ball',
            unit: 258,
          },
        ],
      },
    })
    const response = await CreateSquadInvitesMutation(
      'some-user-id',
      ['bob@gmail.com'],
      'alec',
      'personal message'
    )
    expect(response).toEqual({
      currentMission: {
        squadName: 'TestSquad',
        started: '2017-07-11T03:05:12Z',
        completed: null,
        missionId: '123456789',
        status: 'started',
        tabGoal: 1000,
        tabCount: 900,
        squadMembers: [
          {
            username: 'kevin',
            invitedEmail: null,
            status: 'accepted',
            tabs: 66,
          },
          {
            username: 'alec',
            invitedEmail: null,
            status: 'accepted',
            tabs: 834,
          },
          {
            username: null,
            invitedEmail: 'alec+897234@tabforacause.org',
            status: 'pending',
            tabs: 0,
          },
          {
            username: null,
            invitedEmail: 'alec+1s@tabforacause.org',
            status: 'pending',
            tabs: 0,
          },
        ],
        endOfMissionAwards: [
          { user: 'abcdefghijklmno', awardType: 'Consistent Kitty', unit: 6 },
          { user: 'omnlkjihgfedcba', awardType: 'Hot Paws', unit: 20 },
          {
            user: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
            awardType: 'All-Star Fur Ball',
            unit: 258,
          },
        ],
      },
    })
  })
})

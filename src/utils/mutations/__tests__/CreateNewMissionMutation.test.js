import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('CreateNewMissionMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const CreateNewMissionMutation = require('src/utils/mutations/CreateNewMissionMutation')
      .default
    await CreateNewMissionMutation('some-user-id', 'some-squad-id')
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          squadName: 'some-squad-id',
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const CreateNewMissionMutation = require('src/utils/mutations/CreateNewMissionMutation')
      .default
    callMutation.mockResolvedValue({
      currentMission: {
        squadName: 'TestSquad',
        missionId: '123456789',
        status: 'pending',
        tabGoal: 1000,
        tabCount: 0,
        squadMembers: [],
      },
    })
    const response = await CreateNewMissionMutation(
      'some-user-id',
      'some-tab-id'
    )
    expect(response).toEqual({
      currentMission: {
        squadName: 'TestSquad',
        missionId: '123456789',
        status: 'pending',
        tabGoal: 1000,
        tabCount: 0,
        squadMembers: [],
      },
    })
  })
})

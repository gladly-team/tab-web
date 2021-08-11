import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('UpdateMissionNotificationMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const updateMissionNotificationMutation = require('src/utils/mutations/UpdateMissionNotificationMutation')
      .default
    await updateMissionNotificationMutation('some-user-id', 'some-tab-id', true)
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          missionId: 'some-tab-id',
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const updateMissionNotificationMutation = require('src/utils/mutations/UpdateMissionNotificationMutation')
      .default
    callMutation.mockResolvedValue({
      success: true,
    })
    const response = await updateMissionNotificationMutation(
      'some-user-id',
      'some-tab-id',
      true
    )
    expect(response).toEqual({
      success: true,
    })
  })
})

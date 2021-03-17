import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SetHasViewedIntroFlowMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const SetHasViewedIntroFlowMutation = require('src/utils/mutations/SetHasViewedIntroFlowMutation')
      .default
    await SetHasViewedIntroFlowMutation({
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
    const SetHasViewedIntroFlowMutation = require('src/utils/mutations/SetHasViewedIntroFlowMutation')
      .default
    callMutation.mockResolvedValue({ hi: 'there' })
    const response = await SetHasViewedIntroFlowMutation({
      enabled: true,
      userId: 'some-user-id',
    })
    expect(response).toEqual({ hi: 'there' })
  })
})

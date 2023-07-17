import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('UpdateWidgetEnabledMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const UpdateWidgetEnabledMutation =
      require('src/utils/mutations/UpdateWidgetEnabledMutation').default
    await UpdateWidgetEnabledMutation(
      { id: 'some-user-id' },
      { id: 'some-tab-id' },
      true
    )
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          widgetId: 'some-tab-id',
          enabled: true,
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const UpdateWidgetEnabledMutation =
      require('src/utils/mutations/UpdateWidgetEnabledMutation').default
    callMutation.mockResolvedValue({
      success: true,
    })
    const response = await UpdateWidgetEnabledMutation(
      { id: 'some-user-id' },
      { id: 'some-tab-id' },
      true
    )
    expect(response).toEqual({
      success: true,
    })
  })
})

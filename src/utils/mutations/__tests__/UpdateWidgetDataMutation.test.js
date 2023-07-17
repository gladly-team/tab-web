import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('UpdateWidgetDataMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const data = {
      some: 'data',
    }
    const UpdateWidgetDataMutation =
      require('src/utils/mutations/UpdateWidgetDataMutation').default
    await UpdateWidgetDataMutation(
      { id: 'some-user-id' },
      { id: 'some-tab-id' },
      data
    )
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          widgetId: 'some-tab-id',
          data,
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const UpdateWidgetDataMutation =
      require('src/utils/mutations/UpdateWidgetDataMutation').default
    callMutation.mockResolvedValue({
      success: true,
    })
    const response = await UpdateWidgetDataMutation(
      { id: 'some-user-id' },
      { id: 'some-tab-id' },
      {}
    )
    expect(response).toEqual({
      success: true,
    })
  })
})

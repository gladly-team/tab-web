import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogTabMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const LogTabMutation = require('src/utils/mutations/LogTabMutation').default
    await LogTabMutation('some-user-id', 'some-tab-id')
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      variables: {
        input: {
          userId: 'some-user-id',
          tabId: 'some-tab-id',
        },
      },
    })
  })

  it('returns the callMutation response', async () => {
    expect.assertions(1)
    const LogTabMutation = require('src/utils/mutations/LogTabMutation').default
    callMutation.mockResolvedValue({
      user: {
        id: 'some-id',
        tabs: 100,
        tabsToday: 5,
      },
    })
    const response = await LogTabMutation('some-user-id', 'some-tab-id')
    expect(response).toEqual({
      user: {
        id: 'some-id',
        tabs: 100,
        tabsToday: 5,
      },
    })
  })
})

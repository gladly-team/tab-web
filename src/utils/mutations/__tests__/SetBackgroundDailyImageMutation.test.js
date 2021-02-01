import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

beforeEach(() => {
  callMutation.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SetBackgroundDailyImageMutation', () => {
  it('calls callMutation with the expected arguments', async () => {
    expect.assertions(1)
    const SetBackgroundDailyImageMutation = require('src/utils/mutations/SetBackgroundDailyImageMutation')
      .default
    await SetBackgroundDailyImageMutation('some-user-id')
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
    const SetBackgroundDailyImageMutation = require('src/utils/mutations/SetBackgroundDailyImageMutation')
      .default
    callMutation.mockResolvedValue({
      user: {
        id: 'some-id',
        backgroundImage: {
          imageURL: 'some-url',
          timestamp: 'some-timestamp',
        },
      },
    })
    const response = await SetBackgroundDailyImageMutation({
      userId: 'some-user-id',
    })
    expect(response).toEqual({
      user: {
        id: 'some-id',
        backgroundImage: {
          imageURL: 'some-url',
          timestamp: 'some-timestamp',
        },
      },
    })
  })
})

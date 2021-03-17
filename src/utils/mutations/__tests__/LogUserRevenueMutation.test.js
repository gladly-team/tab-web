import callMutation from 'src/utils/mutations/callMutation'

jest.mock('react-relay')
jest.mock('src/utils/mutations/callMutation')

const getMockInput = () => ({
  userId: 'user-id-123',
  revenue: 0.0123,
  encodedRevenue: 'encoded-abc-xyz',
  GAMAdvertiserId: 24681357,
  adSize: '300x250',
  aggregationOperation: 'MAX',
  tabId: 'fc63cb6a-c8c7-42a3-98e7-1cb20c79db7f',
  adUnitCode: null,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('LogUserRevenueMutation', () => {
  it('calls commitMutation with expected values', async () => {
    expect.assertions(1)
    const LogUserRevenueMutation = require('src/utils/mutations/LogUserRevenueMutation')
      .default
    const args = getMockInput()
    await LogUserRevenueMutation(args)
    expect(callMutation).toHaveBeenCalledWith({
      mutation: expect.any(Object),
      cache: false,
      variables: {
        input: args,
      },
    })
  })
})

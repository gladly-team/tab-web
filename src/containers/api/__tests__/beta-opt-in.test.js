import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import betaOptInAPI from 'src/pages/api/beta-opt-in'

jest.mock('src/utils/middleware/cookies')
jest.mock('src/utils/middleware/session')
jest.mock('src/utils/middleware/customHeaderRequired')

afterEach(() => {
  jest.clearAllMocks()
})

describe('API: beta-opt-in', () => {
  it('returns a 400 error if there is no request body', async () => {
    expect.assertions(2)
    const mockReq = {
      ...getMockReq(),
      body: undefined,
    }
    const mockRes = getMockRes()
    await betaOptInAPI(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid "optIn" value.',
    })
  })
})

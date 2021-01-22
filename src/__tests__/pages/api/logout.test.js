import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'

jest.mock('next-firebase-auth')
jest.mock('src/utils/middleware/customHeaderRequired')
jest.mock('src/utils/auth/initAuth')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('API: logout', () => {
  it('returns a 200 response if there are no errors', async () => {
    expect.assertions(2)
    const logout = require('src/pages/api/logout').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await logout(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
    })
  })
})

import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'

jest.mock('src/utils/middleware/addUserFromAuthorizationToken')
jest.mock('src/utils/middleware/authProtected')
jest.mock('src/utils/middleware/customHeaderRequired')
jest.mock('src/utils/middleware/onlyPostRequests')
jest.mock('next-firebase-auth')
jest.mock('src/utils/auth/initAuth')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('API: login', () => {
  it('returns a 200 response if there are no errors', async () => {
    expect.assertions(2)
    const loginAPI = require('src/pages/api/login').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await loginAPI(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
    })
  })
})

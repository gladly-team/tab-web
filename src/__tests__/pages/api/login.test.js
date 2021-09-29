import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'

jest.mock('next-firebase-auth')
jest.mock('src/utils/middleware/addUserFromAuthorizationToken')
jest.mock('src/utils/middleware/authProtected')
jest.mock('src/utils/middleware/customHeaderRequired')
jest.mock('src/utils/middleware/onlyPostRequests')
jest.mock('src/utils/auth/initAuth')
jest.mock('src/utils/logger')

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

  it("calls `next-firebase-auth`'s `setAuthCookies` with the req and res", async () => {
    expect.assertions(1)
    const { setAuthCookies } = require('next-firebase-auth')
    const loginAPI = require('src/pages/api/login').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await loginAPI(mockReq, mockRes)
    expect(setAuthCookies).toHaveBeenCalledWith(mockReq, mockRes)
  })

  it('returns a 500 response if `setAuthCookies` errors', async () => {
    expect.assertions(2)
    const { setAuthCookies } = require('next-firebase-auth')
    const mockErr = new Error('Cookies? What are cookies?')
    setAuthCookies.mockImplementationOnce(() => {
      throw mockErr
    })
    const loginAPI = require('src/pages/api/login').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await loginAPI(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Unexpected error.',
    })
  })

  it('calls logger.error if `setAuthCookies` errors', async () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    const { setAuthCookies } = require('next-firebase-auth')
    const mockErr = new Error('Cookies? What are cookies?')
    setAuthCookies.mockImplementationOnce(() => {
      throw mockErr
    })
    const loginAPI = require('src/pages/api/login').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await loginAPI(mockReq, mockRes)
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})

describe('API: login middleware', () => {
  it('uses `onlyPostRequests`', async () => {
    expect.assertions(1)
    const onlyPostRequests =
      require('src/utils/middleware/onlyPostRequests').default
    const loginAPI = require('src/pages/api/login').default
    await loginAPI(getMockReq(), getMockRes())
    expect(onlyPostRequests).toHaveBeenCalled()
  })

  it('use `customHeaderRequired`', async () => {
    expect.assertions(1)
    const customHeaderRequired =
      require('src/utils/middleware/customHeaderRequired').default
    const loginAPI = require('src/pages/api/login').default
    await loginAPI(getMockReq(), getMockRes())
    expect(customHeaderRequired).toHaveBeenCalled()
  })

  it('uses `addUserFromAuthorizationToken`', async () => {
    expect.assertions(1)
    const addUserFromAuthorizationToken =
      require('src/utils/middleware/addUserFromAuthorizationToken').default
    const loginAPI = require('src/pages/api/login').default
    await loginAPI(getMockReq(), getMockRes())
    expect(addUserFromAuthorizationToken).toHaveBeenCalled()
  })

  it('uses `authProtected`', async () => {
    expect.assertions(1)
    const authProtected = require('src/utils/middleware/authProtected').default
    const loginAPI = require('src/pages/api/login').default
    await loginAPI(getMockReq(), getMockRes())
    expect(authProtected).toHaveBeenCalled()
  })
})

import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'

jest.mock('next-firebase-auth')
jest.mock('src/utils/middleware/customHeaderRequired')
jest.mock('src/utils/auth/initAuth')
jest.mock('src/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('API: logout', () => {
  it('returns a 200 response if there are no errors', async () => {
    expect.assertions(2)
    const logoutAPI = require('src/pages/api/logout').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await logoutAPI(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
    })
  })

  it("calls `next-firebase-auth`'s `unsetAuthCookies` with the req and res", async () => {
    expect.assertions(1)
    const { unsetAuthCookies } = require('next-firebase-auth')
    const logoutAPI = require('src/pages/api/logout').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await logoutAPI(mockReq, mockRes)
    expect(unsetAuthCookies).toHaveBeenCalledWith(mockReq, mockRes)
  })

  it('returns a 500 response if `unsetAuthCookies` errors', async () => {
    expect.assertions(2)
    const { unsetAuthCookies } = require('next-firebase-auth')
    const mockErr = new Error('Cookies? What are cookies?')
    unsetAuthCookies.mockImplementationOnce(() => {
      throw mockErr
    })
    const logoutAPI = require('src/pages/api/logout').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await logoutAPI(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Unexpected error.',
    })
  })

  it('calls logger.error if `unsetAuthCookies` errors', async () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    const { unsetAuthCookies } = require('next-firebase-auth')
    const mockErr = new Error('Cookies? What are cookies?')
    unsetAuthCookies.mockImplementationOnce(() => {
      throw mockErr
    })
    const logoutAPI = require('src/pages/api/logout').default
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    await logoutAPI(mockReq, mockRes)
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })
})

describe('API: logout middleware', () => {
  it('does not use `customHeaderRequired` [but we should - need to fix]', async () => {
    expect.assertions(1)
    const customHeaderRequired = require('src/utils/middleware/customHeaderRequired')
      .default
    const logoutAPI = require('src/pages/api/logout').default
    await logoutAPI(getMockReq(), getMockRes())
    expect(customHeaderRequired).not.toHaveBeenCalled()
  })
})

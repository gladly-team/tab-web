import { verifyIdToken } from 'next-firebase-auth'
import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

jest.mock('next-firebase-auth')
jest.mock('src/utils/logger')

beforeEach(() => {
  verifyIdToken.mockResolvedValue(getMockAuthUser())
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('authProtected middleware', () => {
  it('calls the handler when successful', async () => {
    expect.assertions(1)
    const mockReq = {
      ...getMockReq(),
      tab: {
        AuthUser: getMockAuthUser(),
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const authProtected = require('src/utils/middleware/authProtected').default
    await authProtected(mockHandler)(mockReq, mockRes)
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes)
  })

  it('returns a 400 error if the `req.tab.AuthUser` property is not set', async () => {
    expect.assertions(2)
    const mockReq = {
      ...getMockReq(),
      tab: {
        AuthUser: undefined,
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const authProtected = require('src/utils/middleware/authProtected').default
    await authProtected(mockHandler)(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Not authorized.',
    })
  })
})

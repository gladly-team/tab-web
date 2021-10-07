import { verifyIdToken } from 'next-firebase-auth'
import lodashObj from 'lodash/object'
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

describe('addUserFromAuthorizationToken middleware', () => {
  it('calls the handler when successful', async () => {
    expect.assertions(1)
    const mockReq = {
      ...getMockReq(),
      headers: {
        ...getMockReq().headers,
        authorization: 'fake-authorization-value',
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const addUserFromAuthorizationToken =
      require('src/utils/middleware/addUserFromAuthorizationToken').default
    await addUserFromAuthorizationToken(mockHandler)(mockReq, mockRes)
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes)
  })

  it('sets the `req.tab.AuthUser` property with the AuthUser value', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    verifyIdToken.mockResolvedValue(mockAuthUser)
    const mockReq = {
      ...getMockReq(),
      headers: {
        ...getMockReq().headers,
        authorization: 'fake-authorization-value',
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const addUserFromAuthorizationToken =
      require('src/utils/middleware/addUserFromAuthorizationToken').default
    await addUserFromAuthorizationToken(mockHandler)(mockReq, mockRes)
    const modifiedReq = mockHandler.mock.calls[0][0]
    expect(modifiedReq.tab.AuthUser).toEqual(mockAuthUser)
  })

  it('returns a 403 status if the Authorization header is not set', async () => {
    expect.assertions(2)
    const mockReq = {
      ...getMockReq(),
      headers: {
        ...getMockReq().headers,
        authorization: undefined,
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const addUserFromAuthorizationToken =
      require('src/utils/middleware/addUserFromAuthorizationToken').default
    await addUserFromAuthorizationToken(mockHandler)(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid authorization header.',
    })
  })

  it('returns a 403 status if verifyIdToken throws', async () => {
    expect.assertions(2)
    verifyIdToken.mockImplementation(() => {
      throw new Error('Invalid token or something.')
    })
    const mockReq = {
      ...getMockReq(),
      headers: {
        ...getMockReq().headers,
        authorization: 'fake-authorization-value',
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const addUserFromAuthorizationToken =
      require('src/utils/middleware/addUserFromAuthorizationToken').default
    await addUserFromAuthorizationToken(mockHandler)(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid authorization header.',
    })
  })

  it('returns a 500 status if something unexpected goes wrong', async () => {
    expect.assertions(2)

    // Cause some error.
    jest.spyOn(lodashObj, 'set').mockImplementationOnce(() => {
      throw new Error("This shouldn't happen.")
    })

    const mockReq = {
      ...getMockReq(),
      headers: {
        ...getMockReq().headers,
        authorization: 'fake-authorization-value',
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const addUserFromAuthorizationToken =
      require('src/utils/middleware/addUserFromAuthorizationToken').default
    await addUserFromAuthorizationToken(mockHandler)(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(500)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Could not get the user from the Authorization header.',
    })
  })
})

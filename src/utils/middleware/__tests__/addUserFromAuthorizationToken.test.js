import { verifyIdToken } from 'next-firebase-auth'
// import logger from 'src/utils/logger'
// import {
//   CUSTOM_REQ_DATA_KEY,
//   AUTH_USER_KEY,
// } from 'src/utils/middleware/constants'
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
    const addUserFromAuthorizationToken = require('src/utils/middleware/addUserFromAuthorizationToken')
      .default
    await addUserFromAuthorizationToken(mockHandler)(mockReq, mockRes)
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes)
  })
})

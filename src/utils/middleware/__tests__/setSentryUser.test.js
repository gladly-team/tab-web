import * as Sentry from '@sentry/node'
import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import {
  CUSTOM_REQ_DATA_KEY,
  AUTH_USER_KEY,
} from 'src/utils/middleware/constants'

jest.mock('src/utils/logger')
jest.mock('next-firebase-auth', () => ({
  useAuthUser: jest.fn(),
}))
jest.mock('@sentry/node', () => ({
  setUser: jest.fn(),
}))
afterEach(() => {
  jest.clearAllMocks()
})

describe('set Sentry User middleware', () => {
  it('calls the handler after successfully setting the sentry user', async () => {
    expect.assertions(2)
    const mockReq = {
      ...getMockReq(),
      [CUSTOM_REQ_DATA_KEY]: {
        [AUTH_USER_KEY]: { id: 'some-id', email: 'some-email' },
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const setSentryUser = require('src/utils/middleware/setSentryUser').default
    await setSentryUser(mockHandler)(mockReq, mockRes)
    expect(Sentry.setUser).toHaveBeenCalledWith({
      email: 'some-email',
      id: 'some-id',
    })
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes)
  })

  it('calls the handler even if there is no auth user', async () => {
    expect.assertions(2)
    const mockReq = {
      ...getMockReq(),
      [CUSTOM_REQ_DATA_KEY]: {
        [AUTH_USER_KEY]: { email: 'some-email' },
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const setSentryUser = require('src/utils/middleware/setSentryUser').default
    await setSentryUser(mockHandler)(mockReq, mockRes)
    expect(Sentry.setUser).not.toHaveBeenCalled()
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes)
  })
})

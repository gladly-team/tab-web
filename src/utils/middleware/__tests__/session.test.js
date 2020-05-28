import { withCookies } from 'src/utils/middleware/cookies'
import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import session, { withSession } from 'src/utils/middleware/session'
import { encodeBase64 } from 'src/utils/encoding'
import { createAuthUserInfo } from 'src/utils/auth/user'

jest.mock('src/utils/middleware/cookies')

const mockSessionCookieAuthed = () => {
  withCookies.mockImplementation((req) => {
    req.cookie = {
      get: () =>
        encodeBase64({
          AuthUserInfo: createAuthUserInfo({
            firebaseUser: {
              uid: 'some-fake-id',
              email: 'fake@example.com',
              email_verified: false,
            },
            token: 'my-fake-token',
            isClientInitialized: false,
          }),
        }),
      set: () => {},
    }
  })
}

const mockSessionCookieUnset = () => {
  withCookies.mockImplementation((req) => {
    req.cookie = {
      get: () => undefined,
      set: () => {},
    }
  })
}

beforeEach(() => {
  process.env.SESSION_SECRET_CURRENT = 'abc'
  process.env.SESSION_SECRET_PREVIOUS = 'def'
  mockSessionCookieAuthed()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('session middleware: withSession', () => {
  it('has a req.session object if the user has a session cookie', () => {
    expect.assertions(2)
    mockSessionCookieAuthed() // mock an auth cookie
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    expect(mockReq.session).toBeUndefined()
    withSession(mockReq, mockRes)
    expect(mockReq.session).toEqual(expect.any(Object))
  })

  it('has an undefined req.session object if the user does not have a session cookie', () => {
    expect.assertions(2)
    mockSessionCookieUnset() // mock a user without an auth cookie
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    expect(mockReq.session).toBeUndefined()
    withSession(mockReq, mockRes)
    expect(mockReq.session).toBeUndefined()
  })
})

describe('session middleware: wrapper', () => {
  it('calls the handler with a req object that contains a req.session object if the user has a session cookie', () => {
    expect.assertions(3)
    mockSessionCookieAuthed() // mock an auth cookie
    const mockHandler = jest.fn()
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    expect(mockReq.session).toBeUndefined()
    session(mockHandler)(mockReq, mockRes)
    expect(mockHandler).toHaveBeenCalledTimes(1)
    const reqProvidedToHandler = mockHandler.mock.calls[0][0]
    expect(reqProvidedToHandler.session).toEqual(expect.any(Object))
  })

  it('calls the handler with a req object that contains an undefined req.session if the user does not have a session cookie', () => {
    expect.assertions(3)
    mockSessionCookieUnset() // mock a user without an auth cookie
    const mockHandler = jest.fn()
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    expect(mockReq.session).toBeUndefined()
    session(mockHandler)(mockReq, mockRes)
    expect(mockHandler).toHaveBeenCalledTimes(1)
    const reqProvidedToHandler = mockHandler.mock.calls[0][0]
    expect(reqProvidedToHandler.session).toBeUndefined()
  })
})

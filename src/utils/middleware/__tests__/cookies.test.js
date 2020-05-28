import Cookies from 'cookies'
import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import cookies, { withCookies } from 'src/utils/middleware/cookies'

const mockCookie = jest.fn(() => ({
  get: jest.fn(),
  set: jest.fn(),
}))

jest.mock('cookies', () => jest.fn(() => mockCookie))

beforeEach(() => {
  process.env.SESSION_SECRET_CURRENT = 'abc'
  process.env.SESSION_SECRET_PREVIOUS = 'def'
  process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE = 'true'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('cookies middleware: withCookies', () => {
  it('sets a req.cookie object', () => {
    expect.assertions(2)
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    expect(mockReq.cookie).toBeUndefined()
    withCookies(mockReq, mockRes)
    expect(mockReq.cookie).toEqual(expect.any(Object))
  })

  it('passes the request and response objects to Cookies', () => {
    expect.assertions(1)
    process.env.SESSION_SECRET_CURRENT = 'thing'
    process.env.SESSION_SECRET_PREVIOUS = 'anotherThing'
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    withCookies(mockReq, mockRes)
    expect(Cookies).toHaveBeenCalledWith(mockReq, mockRes, expect.any(Object))
  })

  it('passes the expected secrets to Cookies', () => {
    expect.assertions(1)
    process.env.SESSION_SECRET_CURRENT = 'thing'
    process.env.SESSION_SECRET_PREVIOUS = 'anotherThing'
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    withCookies(mockReq, mockRes)
    const optionsForCookies = Cookies.mock.calls[0][2]
    expect(optionsForCookies).toMatchObject({
      keys: ['thing', 'anotherThing'],
    })
  })

  it('sets the "secure" option to true in Cookies when secure cookies are configured', () => {
    expect.assertions(1)
    process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE = 'true'
    withCookies(getMockReq(), getMockRes())
    const optionsForCookies = Cookies.mock.calls[0][2]
    expect(optionsForCookies).toMatchObject({
      secure: true,
    })
  })

  it('sets the "secure" option to false in Cookies when secure cookies are disabled', () => {
    expect.assertions(1)
    process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE = 'false'
    withCookies(getMockReq(), getMockRes())
    const optionsForCookies = Cookies.mock.calls[0][2]
    expect(optionsForCookies).toMatchObject({
      secure: false,
    })
  })

  it('sets the "secure" option to false in Cookies when secure cookies are not configured', () => {
    expect.assertions(1)
    process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE = undefined
    withCookies(getMockReq(), getMockRes())
    const optionsForCookies = Cookies.mock.calls[0][2]
    expect(optionsForCookies).toMatchObject({
      secure: false,
    })
  })
})

describe('cookies middleware: wrapper', () => {
  it('calls the handler with a req object that contains a req.cookie object', () => {
    expect.assertions(3)
    const mockHandler = jest.fn()
    const mockReq = getMockReq()
    const mockRes = getMockRes()
    expect(mockReq.cookie).toBeUndefined()
    cookies(mockHandler)(mockReq, mockRes)
    expect(mockHandler).toHaveBeenCalledTimes(1)
    const reqProvidedToHandler = mockHandler.mock.calls[0][0]
    expect(reqProvidedToHandler.cookie).toEqual(expect.any(Object))
  })
})

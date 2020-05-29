import Cookies from 'cookies'
import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import cookies, { withCookies } from 'src/utils/middleware/cookies'

const mockCookie = {
  get: jest.fn(),
  set: jest.fn(),
}

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

  it('throws if the session key SESSION_SECRET_CURRENT is not defined', () => {
    expect.assertions(1)
    delete process.env.SESSION_SECRET_CURRENT
    expect(() => {
      withCookies(getMockReq(), getMockRes())
    }).toThrow(
      'Session secrets must be set as env vars `SESSION_SECRET_CURRENT` and `SESSION_SECRET_PREVIOUS`.'
    )
  })

  it('throws if the session key SESSION_SECRET_PREVIOUS is not defined', () => {
    expect.assertions(1)
    delete process.env.SESSION_SECRET_PREVIOUS
    expect(() => {
      withCookies(getMockReq(), getMockRes())
    }).toThrow(
      'Session secrets must be set as env vars `SESSION_SECRET_CURRENT` and `SESSION_SECRET_PREVIOUS`.'
    )
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
    delete process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE
    withCookies(getMockReq(), getMockRes())
    const optionsForCookies = Cookies.mock.calls[0][2]
    expect(optionsForCookies).toMatchObject({
      secure: false,
    })
  })

  it("calls the Cookies library's cookies.get when calling cookie.get", () => {
    expect.assertions(1)
    const mockReq = getMockReq()
    withCookies(mockReq, getMockRes())
    mockReq.cookie.get('chocolateChip')
    expect(mockCookie.get).toHaveBeenCalledWith('chocolateChip', {
      signed: true,
    })
  })

  it("calls the Cookies library's cookies.set when calling cookie.set", () => {
    expect.assertions(1)
    const mockReq = getMockReq()
    withCookies(mockReq, getMockRes())
    mockReq.cookie.set('chocolateChip', 'delicious')
    expect(mockCookie.set).toHaveBeenCalledWith(
      'chocolateChip',
      'delicious',
      expect.any(Object)
    )
  })

  it('uses some expected default cookie settings when calling cookie.set', () => {
    expect.assertions(1)
    const mockReq = getMockReq()
    withCookies(mockReq, getMockRes())
    mockReq.cookie.set('chocolateChip', 'delicious')
    const cookieSetOpts = mockCookie.set.mock.calls[0][2]
    expect(cookieSetOpts).toMatchObject({
      httpOnly: true,
      maxAge: 604800000,
      overwrite: true,
    })
  })

  it('allows overriding some default cookie settings when calling cookie.set', () => {
    expect.assertions(1)
    const mockReq = getMockReq()
    withCookies(mockReq, getMockRes())
    mockReq.cookie.set('chocolateChip', 'delicious', {
      httpOnly: false,
      maxAge: 140,
      overwrite: false,
    })
    const cookieSetOpts = mockCookie.set.mock.calls[0][2]
    expect(cookieSetOpts).toMatchObject({
      httpOnly: false,
      maxAge: 140,
      overwrite: false,
    })
  })

  it('sets a secure cookie with SameSite=None when enabled', () => {
    expect.assertions(1)
    process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE = 'true'
    const mockReq = getMockReq()
    withCookies(mockReq, getMockRes())
    mockReq.cookie.set('chocolateChip', 'delicious')
    const cookieSetOpts = mockCookie.set.mock.calls[0][2]
    expect(cookieSetOpts).toMatchObject({
      secure: true,
      sameSite: 'none',
    })
  })

  it('sets an insecure cookie with SameSite=Strict when secure cookies are not enabled', () => {
    expect.assertions(1)
    process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE = 'false'
    const mockReq = getMockReq()
    withCookies(mockReq, getMockRes())
    mockReq.cookie.set('chocolateChip', 'delicious')
    const cookieSetOpts = mockCookie.set.mock.calls[0][2]
    expect(cookieSetOpts).toMatchObject({
      secure: false,
      sameSite: 'strict',
    })
  })

  it('does not allow overriding some secure/SameSite cookie settings when calling cookie.set', () => {
    expect.assertions(1)
    process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE = 'true'
    const mockReq = getMockReq()
    withCookies(mockReq, getMockRes())
    mockReq.cookie.set('chocolateChip', 'delicious', {
      secure: false,
      sameSite: 'strict',
    })
    const cookieSetOpts = mockCookie.set.mock.calls[0][2]
    expect(cookieSetOpts).toMatchObject({
      secure: true,
      sameSite: 'none',
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

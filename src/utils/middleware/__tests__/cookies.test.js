// import Cookies from 'cookies'
import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import cookies, { withCookies } from 'src/utils/middleware/cookies'

jest.mock('cookies')

beforeEach(() => {
  process.env.SESSION_SECRET_CURRENT = 'abc'
  process.env.SESSION_SECRET_PREVIOUS = 'def'
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

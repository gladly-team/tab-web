import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'

jest.mock('src/utils/middleware/onlyPostRequests')
jest.mock('src/utils/middleware/cookies')
jest.mock('src/utils/middleware/customHeaderRequired')

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('API: beta-opt-in', () => {
  it('returns a 400 error if there is no request body', async () => {
    expect.assertions(2)
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    const mockReq = {
      ...getMockReq(),
      body: undefined,
    }
    const mockRes = getMockRes()
    await betaOptInAPI(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid "optIn" value.',
    })
  })

  it('returns a 200 response if the request body.optIn is set', async () => {
    expect.assertions(2)
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    const mockReq = {
      ...getMockReq(),
      body: { optIn: false },
    }
    const mockRes = getMockRes()
    await betaOptInAPI(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({ status: true })
  })

  it('sets the Tab v4 opt in cookie if body.optIn is true', async () => {
    expect.assertions(1)
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    const mockReq = {
      ...getMockReq(),
      body: { optIn: true },
    }
    const mockRes = getMockRes()
    await betaOptInAPI(mockReq, mockRes)
    expect(mockReq.cookie.set).toHaveBeenCalledWith(
      'tabV4OptIn',
      'enabled',
      expect.any(Object)
    )
  })

  it('sets the max age of the Tab v4 opt in cookie to 5 years (setting cookie when body.optIn is true)', async () => {
    expect.assertions(1)
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    const mockReq = {
      ...getMockReq(),
      body: { optIn: true },
    }
    const mockRes = getMockRes()
    await betaOptInAPI(mockReq, mockRes)
    expect(mockReq.cookie.set.mock.calls[0][2]).toMatchObject({
      maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
    })
  })

  it('unsets the Tab v4 opt in cookie if body.optIn is false', async () => {
    expect.assertions(1)
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    const mockReq = {
      ...getMockReq(),
      body: { optIn: false },
    }
    const mockRes = getMockRes()
    await betaOptInAPI(mockReq, mockRes)
    expect(mockReq.cookie.set).toHaveBeenCalledWith(
      'tabV4OptIn',
      undefined,
      expect.any(Object)
    )
  })
})

describe('API: beta-opt-in middleware', () => {
  it('uses `onlyPostRequests`', async () => {
    expect.assertions(1)
    const onlyPostRequests =
      require('src/utils/middleware/onlyPostRequests').default
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    await betaOptInAPI(getMockReq(), getMockRes())
    expect(onlyPostRequests).toHaveBeenCalled()
  })

  it('uses `cookies`', async () => {
    expect.assertions(1)
    const cookies = require('src/utils/middleware/cookies').default
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    await betaOptInAPI(getMockReq(), getMockRes())
    expect(cookies).toHaveBeenCalled()
  })

  it('uses `customHeaderRequired`', async () => {
    expect.assertions(1)
    const customHeaderRequired =
      require('src/utils/middleware/customHeaderRequired').default
    const betaOptInAPI = require('src/pages/api/beta-opt-in').default
    await betaOptInAPI(getMockReq(), getMockRes())
    expect(customHeaderRequired).toHaveBeenCalled()
  })
})

import { apiLogin, apiLogout, authURL, dashboardURL } from 'src/utils/urls'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import getMockFetchResponse from 'src/utils/testHelpers/getMockFetchResponse'
import getMockFetchErrorResponse from 'src/utils/testHelpers/getMockFetchErrorResponse'
import { CUSTOM_HEADER_NAME } from 'src/utils/middleware/constants'

jest.mock('next-firebase-auth')

beforeEach(() => {
  process.env.COOKIE_SECURE_SAME_SITE_NONE = 'true'
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('initAuth.js', () => {
  it('calls next-firebase-auth init', async () => {
    expect.assertions(1)
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    expect(initNFA).toHaveBeenCalled()
  })

  it('uses the expected cookie name', async () => {
    expect.assertions(1)
    process.env.COOKIE_SECURE_SAME_SITE_NONE = 'true'
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    const config = initNFA.mock.calls[0][0]
    expect(config.cookies).toMatchObject({
      name: 'TabAuth', // do not change this
    })
  })

  it('uses the expected URLs and endpoints', async () => {
    expect.assertions(1)
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    const config = initNFA.mock.calls[0][0]
    expect(config).toMatchObject({
      authPageURL: authURL,
      appPageURL: dashboardURL,
    })
  })

  it('expects config to have tokenChangedHandler', async () => {
    expect.assertions(1)
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    const config = initNFA.mock.calls[0][0]
    expect(config).toHaveProperty('tokenChangedHandler')
  })

  it('tokenChangedHandler calls login endpoint and sets custom header', async () => {
    expect.assertions(2)
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    fetch.mockResolvedValue(getMockFetchResponse())
    const config = initNFA.mock.calls[0][0]
    expect(config).toHaveProperty('tokenChangedHandler')
    await config.tokenChangedHandler(getMockAuthUser())
    expect(fetch).toHaveBeenCalledWith(apiLogin, {
      headers: {
        Authorization: await getMockAuthUser().getIdToken(),
        [CUSTOM_HEADER_NAME]: 'tabV4',
      },
      method: 'POST',
      credentials: 'include',
    })
  })

  it('tokenChangedHandler throws if login endpoint call fails', async () => {
    expect.assertions(2)
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    fetch.mockResolvedValue(getMockFetchErrorResponse())
    const config = initNFA.mock.calls[0][0]
    expect(config).toHaveProperty('tokenChangedHandler')
    await expect(
      config.tokenChangedHandler(getMockAuthUser())
    ).rejects.toThrow()
  })

  it('tokenChangedHandler calls logout endpoint and sets custom header', async () => {
    expect.assertions(2)
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    fetch.mockResolvedValue(getMockFetchResponse())
    const config = initNFA.mock.calls[0][0]
    expect(config).toHaveProperty('tokenChangedHandler')
    await config.tokenChangedHandler({})
    expect(fetch).toHaveBeenCalledWith(apiLogout, {
      headers: {
        [CUSTOM_HEADER_NAME]: 'tabV4',
      },
      method: 'POST',
      credentials: 'include',
    })
  })

  it('tokenChangedHandler throws if logout endpoint call fails', async () => {
    expect.assertions(2)
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    fetch.mockResolvedValue(getMockFetchErrorResponse())
    const config = initNFA.mock.calls[0][0]
    expect(config).toHaveProperty('tokenChangedHandler')
    await expect(config.tokenChangedHandler({})).rejects.toThrow()
  })

  it('sets cookies to be secure and SameSite=None when the related env var is set', async () => {
    expect.assertions(1)
    process.env.COOKIE_SECURE_SAME_SITE_NONE = 'true'
    const { init: initNFA } = require('next-firebase-auth')
    const initAuth = require('src/utils/auth/initAuth').default
    initAuth()
    const config = initNFA.mock.calls[0][0]
    expect(config.cookies).toMatchObject({
      sameSite: 'none',
      secure: true,
    })
  })
})

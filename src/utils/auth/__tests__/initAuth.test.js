import { apiLogin, apiLogout, authURL, dashboardURL } from 'src/utils/urls'

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
      loginAPIEndpoint: apiLogin,
      logoutAPIEndpoint: apiLogout,
    })
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

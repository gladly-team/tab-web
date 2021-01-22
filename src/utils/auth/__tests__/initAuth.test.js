// import { apiLogin, apiLogout, authURL, dashboardURL } from 'src/utils/urls'

jest.mock('next-firebase-auth')

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
})

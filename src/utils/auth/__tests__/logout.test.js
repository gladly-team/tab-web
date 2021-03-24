import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'
import { authURL } from 'src/utils/urls'
import { setWindowLocation } from 'src/utils/navigation'

jest.mock('src/utils/caching')
jest.mock('src/utils/logger')
jest.mock('src/utils/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

describe('logout.js', () => {
  it('calls AuthUser.signOut', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    const logout = require('src/utils/auth/logout').default
    await logout(mockAuthUser)
    expect(mockAuthUser.signOut).toHaveBeenCalled()
  })

  it('calls clearAllServiceWorkerCaches', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    const logout = require('src/utils/auth/logout').default
    await logout(mockAuthUser)
    expect(clearAllServiceWorkerCaches).toHaveBeenCalled()
  })

  it('calls setWindowLocation to navigate to the auth page', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    const logout = require('src/utils/auth/logout').default
    await logout(mockAuthUser)
    expect(setWindowLocation).toHaveBeenCalledWith(authURL)
  })

  it('logs an error when something fails', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    const mockErr = new Error('Uh oh.')
    clearAllServiceWorkerCaches.mockImplementationOnce(() => {
      throw mockErr
    })
    const logout = require('src/utils/auth/logout').default
    await logout(mockAuthUser)
    expect(logger.error).toHaveBeenCalledWith(mockErr)
  })

  it('resolves to `true` on success', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    const logout = require('src/utils/auth/logout').default
    const result = await logout(mockAuthUser)
    expect(result).toBe(true)
  })

  it('resolves to `false` on failure', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    const mockErr = new Error('Uh oh.')
    clearAllServiceWorkerCaches.mockImplementationOnce(() => {
      throw mockErr
    })
    const logout = require('src/utils/auth/logout').default
    const result = await logout(mockAuthUser)
    expect(result).toBe(false)
  })
})

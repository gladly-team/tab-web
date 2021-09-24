import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'
import localStorageMgr from 'src/utils/localstorage-mgr'

jest.mock('src/utils/caching')
jest.mock('src/utils/logger')
jest.mock('src/utils/localstorage-mgr')
afterEach(() => {
  jest.clearAllMocks()
})

describe('logout.js', () => {
  it('calls AuthUser.signOut', async () => {
    expect.assertions(1)
    clearAllServiceWorkerCaches.mockResolvedValueOnce()
    const mockAuthUser = getMockAuthUser()
    const logout = require('src/utils/auth/logout').default
    await logout(mockAuthUser)
    expect(mockAuthUser.signOut).toHaveBeenCalled()
  })

  it('clears local storage', async () => {
    expect.assertions(1)
    clearAllServiceWorkerCaches.mockResolvedValueOnce()
    const mockAuthUser = getMockAuthUser()
    const logout = require('src/utils/auth/logout').default
    await logout(mockAuthUser)
    expect(localStorageMgr.clear).toHaveBeenCalled()
  })

  it('calls clearAllServiceWorkerCaches', async () => {
    expect.assertions(1)
    const mockAuthUser = getMockAuthUser()
    const logout = require('src/utils/auth/logout').default
    await logout(mockAuthUser)
    expect(clearAllServiceWorkerCaches).toHaveBeenCalled()
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
    clearAllServiceWorkerCaches.mockResolvedValueOnce()
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

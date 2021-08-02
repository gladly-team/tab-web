/* global window */

describe('local storage mng', () => {
  it('contains expected methods', () => {
    const localStorageMgrMethods = ['getItem', 'setItem', 'removeItem']
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgrMethods.forEach((method) => {
      expect(localStorageMgr[method]).not.toBeUndefined()
    })
  })

  it('getItem calls localStorage.getItem', () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgr.getItem('somekey')
    expect(window.localStorage.getItem).toHaveBeenCalledWith('somekey')
  })

  it('getItem calls localStorage.setItem', () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgr.setItem('somekey', 'someval')
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'somekey',
      'someval'
    )
  })

  it('getItem calls localStorage.removeitemItem', () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgr.removeItem('somekey')
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('somekey')
  })

  it("getItem doesn't throw even if localStorage throws", () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    window.localStorage.getItem.mockImplementationOnce(() => {
      throw new Error('This browser is not a fan of localStorage.')
    })
    expect(() => {
      localStorageMgr.getItem('somekey')
    }).not.toThrow()
    expect(localStorageMgr.getItem('somekey')).toBeNull()
  })

  it("setItem doesn't throw", () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    expect(() => {
      localStorageMgr.setItem('somekey', 'somevalue')
    }).not.toThrow()
  })

  it("removeItem doesn't throw", () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    expect(() => {
      localStorageMgr.removeItem('somekey')
    }).not.toThrow()
  })
})

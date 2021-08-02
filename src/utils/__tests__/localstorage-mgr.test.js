/* global window */

describe('local storage mng', () => {
  it('getItem calls localStorage.getItem', () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgr.getItem('somekey')
    expect(window.localStorage.getItem).toHaveBeenCalledWith('somekey')
  })

  it('setItem calls localStorage.setItem', () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgr.setItem('somekey', 'someval')
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      'somekey',
      'someval'
    )
  })

  it('removeItem calls localStorage.removeItem', () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgr.removeItem('somekey')
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('somekey')
  })

  it('clear calls localStorage.clear', () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgr.clear()
    expect(window.localStorage.clear).toHaveBeenCalledWith()
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

  it("setItem doesn't throw even if localStorage throws", () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    window.localStorage.setItem.mockImplementationOnce(() => {
      throw new Error('This browser is not a fan of localStorage.')
    })
    expect(() => {
      localStorageMgr.setItem('somekey', 'somevalue')
    }).not.toThrow()
  })

  it("removeItem doesn't throw even if localStorage throws", () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    window.localStorage.removeItem.mockImplementationOnce(() => {
      throw new Error('This browser is not a fan of localStorage.')
    })
    expect(() => {
      localStorageMgr.removeItem('somekey')
    }).not.toThrow()
  })

  it("clear doesn't throw even if localStorage throws", () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    window.localStorage.clear.mockImplementationOnce(() => {
      throw new Error('This browser is not a fan of localStorage.')
    })
    expect(() => {
      localStorageMgr.clear()
    }).not.toThrow()
  })
})

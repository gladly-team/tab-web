describe('local storage mng', () => {
  it('contains expected methods', () => {
    const localStorageMgrMethods = ['getItem', 'setItem', 'removeItem']
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    localStorageMgrMethods.forEach((method) => {
      expect(localStorageMgr[method]).not.toBeUndefined()
    })
  })

  it("getItem doesn't throw", () => {
    const localStorageMgr = require('src/utils/localstorage-mgr').default
    expect(() => {
      localStorageMgr.getItem('somekey')
    }).not.toThrow()
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

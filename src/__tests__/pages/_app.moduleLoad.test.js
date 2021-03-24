// Tests for module loading, which require resetting modules
// between tests. A separate test file is simpler than refactoring
// existing tests.
// In addition, Jest's `resetModules` is buggy with hooks:
// https://github.com/facebook/jest/issues/8987
/* eslint-disable no-console */

jest.mock('next/router')
jest.mock('next-offline/runtime')
jest.mock('src/utils/ssr')
jest.mock('src/utils/auth/initAuth')
jest.mock('src/utils/initSentry')
jest.mock('src/utils/initializeCMP')
jest.mock('src/utils/navigation')

// Don't enforce env vars during unit tests.
jest.mock('src/utils/ensureValuesAreDefined')

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  if (console.warn.mockReset) {
    console.warn.mockReset()
  }
  jest.resetModules()
})

describe('_app.js: Sentry', () => {
  it('calls to initialize Sentry', () => {
    expect.assertions(1)
    const initSentry = require('src/utils/initSentry').default

    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(initSentry).toHaveBeenCalled()
  })
})

describe('_app.js: initializes auth', () => {
  it('initializes authentication on module load', () => {
    expect.assertions(1)
    const initAuth = require('src/utils/auth/initAuth').default
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(initAuth).toHaveBeenCalledTimes(1)
  })
})

describe('_app.js: tab-cmp', () => {
  it('initializes the CMP when on the client side', () => {
    expect.assertions(1)
    const { isClientSide } = require('src/utils/ssr')
    isClientSide.mockReturnValue(true)

    const initializeCMP = require('src/utils/initializeCMP').default

    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    jest.runAllTimers()
    expect(initializeCMP).toHaveBeenCalled()
  })

  it('does not initialize the CMP when on the server side', () => {
    expect.assertions(1)
    const { isClientSide } = require('src/utils/ssr')
    isClientSide.mockReturnValue(false)

    const initializeCMP = require('src/utils/initializeCMP').default

    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    jest.runAllTimers()
    expect(initializeCMP).not.toHaveBeenCalled()
  })
})

describe('_app.js: router overrides', () => {
  it('sets a callback to the "routeChangeStart" router event', () => {
    expect.assertions(1)
    const Router = require('next/router')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(Router.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    )
  })

  it('the "routeChangeStart" event calls setWindowLocation and throws when calling the base auth URL', () => {
    expect.assertions(2)
    const Router = require('next/router')
    const { setWindowLocation } = require('src/utils/navigation')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    const routeChangeStartCallback = Router.events.on.mock.calls[0][1]
    expect(() => {
      routeChangeStartCallback('/newtab/auth/')
    }).toThrow('routeChange aborted. This error can be safely ignored.')
    expect(setWindowLocation).toHaveBeenCalledWith('/newtab/auth/', {
      addBasePath: false,
    })
  })

  it('the "routeChangeStart" event calls setWindowLocation and throws when calling some other auth URL', () => {
    expect.assertions(2)
    const Router = require('next/router')
    const { setWindowLocation } = require('src/utils/navigation')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    const routeChangeStartCallback = Router.events.on.mock.calls[0][1]
    expect(() => {
      routeChangeStartCallback('/newtab/auth/some/page/here/')
    }).toThrow('routeChange aborted. This error can be safely ignored.')
    expect(setWindowLocation).toHaveBeenCalledWith(
      '/newtab/auth/some/page/here/',
      {
        addBasePath: false,
      }
    )
  })

  it('the "routeChangeStart" event does *not* call setWindowLocation or throws when calling some non-auth URL', () => {
    expect.assertions(2)
    const Router = require('next/router')
    const { setWindowLocation } = require('src/utils/navigation')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    const routeChangeStartCallback = Router.events.on.mock.calls[0][1]
    expect(() => {
      routeChangeStartCallback('/newtab/account/')
    }).not.toThrow()
    expect(setWindowLocation).not.toHaveBeenCalled()
  })
})

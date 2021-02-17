// Tests for module loading, which require resetting modules
// between tests. A separate test file is simpler than refactoring
// existing tests.
// In addition, Jest's `resetModules` is buggy with hooks:
// https://github.com/facebook/jest/issues/8987
/* eslint-disable no-console */

jest.mock('next-offline/runtime')
jest.mock('src/utils/ssr')
jest.mock('src/utils/auth/initAuth')
jest.mock('src/utils/initSentry')
jest.mock('src/utils/initializeCMP')

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

// Tests for module loading, which require resetting modules
// between tests. A separate test file is simpler than refactoring
// existing tests.
// In addition, Jest's `resetModules` is buggy with hooks:
// https://github.com/facebook/jest/issues/8987
/* eslint-disable no-console */

jest.mock('next-offline/runtime')
jest.mock('src/utils/ssr')
jest.mock('@sentry/node')
jest.mock('src/utils/auth/initAuth')

// Don't enforce env vars during unit tests.
jest.mock('src/utils/ensureValuesAreDefined')

afterEach(() => {
  if (console.warn.mockReset) {
    console.warn.mockReset()
  }
  jest.resetModules()
})

describe('_app.js: initializes Sentry', () => {
  it('initializes Sentry when the Sentry DSN is defined', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'some-dsn'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(Sentry.init).toHaveBeenCalled()
  })

  it('passes the Sentry DSN when intializing', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'this-is-my-dsn'
    process.env.NODE_ENV = 'production'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(Sentry.init.mock.calls[0][0]).toMatchObject({
      dsn: 'this-is-my-dsn',
    })
  })

  it('initializes Sentry with "enabled" = true when NODE_ENV is production', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'some-dsn'
    process.env.NODE_ENV = 'production'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(Sentry.init.mock.calls[0][0]).toMatchObject({
      enabled: true,
    })
  })

  it('initializes Sentry with "enabled" = false when NODE_ENV is development', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SENTRY_DSN = 'some-dsn'
    process.env.NODE_ENV = 'development'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(Sentry.init.mock.calls[0][0]).toMatchObject({
      enabled: false,
    })
  })

  it('does not intitalize Sentry when the Sentry DSN is not defined', () => {
    expect.assertions(1)
    delete process.env.NEXT_PUBLIC_SENTRY_DSN

    // Suppress expected console warning.
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/pages/_app.js').default
    expect(Sentry.init).not.toHaveBeenCalled()
  })
})

describe('_app.js: initializes auth', () => {
  it('initializes authentication on module load', () => {
    expect.assertions(1)
    const initAuth = require('src/utils/auth/initAuth').default
    require('src/pages/_app.js').default
    expect(initAuth).toHaveBeenCalledTimes(1)
  })
})

// Tests for module loading, which require resetting modules
// between tests. A separate test file is simpler than refactoring
// existing tests.
// In addition, Jest's `resetModules` is buggy with hooks:
// https://github.com/facebook/jest/issues/8987
/* eslint-disable no-console */

jest.mock('next-offline/runtime')
jest.mock('src/utils/auth/hooks')
jest.mock('src/utils/auth/user')
jest.mock('src/utils/middleware/session')
jest.mock('src/utils/ssr')
jest.mock('@sentry/node')

afterEach(() => {
  if (console.warn.mockReset) {
    console.warn.mockReset()
  }
  jest.resetModules()
})

describe('_app.js: initializes Sentry', () => {
  it('intitalizes Sentry when the Sentry DSN is defined', () => {
    expect.assertions(1)
    process.env.SENTRY_DSN = 'some-dsn'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/containers/_app.js').default
    expect(Sentry.init).toHaveBeenCalled()
  })

  it('passes the Sentry DSN when intializing', () => {
    expect.assertions(1)
    process.env.SENTRY_DSN = 'this-is-my-dsn'
    process.env.NODE_ENV = 'production'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/containers/_app.js').default
    expect(Sentry.init.mock.calls[0][0]).toMatchObject({
      dsn: 'this-is-my-dsn',
    })
  })

  it('intitalizes Sentry with "enabled" = true when NODE_ENV is production', () => {
    expect.assertions(1)
    process.env.SENTRY_DSN = 'some-dsn'
    process.env.NODE_ENV = 'production'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/containers/_app.js').default
    expect(Sentry.init.mock.calls[0][0]).toMatchObject({
      enabled: true,
    })
  })

  it('intitalizes Sentry with "enabled" = false when NODE_ENV is development', () => {
    expect.assertions(1)
    process.env.SENTRY_DSN = 'some-dsn'
    process.env.NODE_ENV = 'development'
    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/containers/_app.js').default
    expect(Sentry.init.mock.calls[0][0]).toMatchObject({
      enabled: false,
    })
  })

  it('does not intitalize Sentry when the Sentry DSN is not defined', () => {
    expect.assertions(1)
    delete process.env.SENTRY_DSN

    // Suppress expected console warning.
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    const Sentry = require('@sentry/node')
    // eslint-disable-next-line no-unused-expressions
    require('src/containers/_app.js').default
    expect(Sentry.init).not.toHaveBeenCalled()
  })
})

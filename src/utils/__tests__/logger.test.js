/* eslint-disable  no-console */
import * as Sentry from '@sentry/node'

jest.mock('@sentry/node')
jest.mock('src/utils/initSentry')

beforeEach(() => {
  process.env.NEXT_PUBLIC_ENABLE_SENTRY_LOGGING = 'true'

  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'info').mockImplementation(() => {})
  jest.spyOn(console, 'debug').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('logger', () => {
  it('contains expected methods', () => {
    const loggerMethods = ['log', 'debug', 'info', 'warn', 'error']
    const logger = require('src/utils/logger').default
    loggerMethods.forEach((method) => {
      expect(logger[method]).not.toBeUndefined()
    })
  })
})

describe('logger: production', () => {
  test('logger.error calls Sentry.captureException when called with an error', () => {
    expect.assertions(2)
    const logger = require('src/utils/logger').default
    const theErr = new Error('A big problem')
    logger.error(theErr)
    expect(Sentry.captureException).toHaveBeenCalledWith(theErr)
    expect(Sentry.captureMessage).not.toHaveBeenCalled()
  })

  test('logger.error calls Sentry.captureMessage at the "error" level when provided a string', () => {
    expect.assertions(2)
    const logger = require('src/utils/logger').default
    logger.error('A thing happened, FYI')
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'A thing happened, FYI',
      'error'
    )
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  test('logger.error concatenates multiple arguments into a single message', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.error('A thing happened, FYI', 'and this was the number:', 123)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'A thing happened, FYI, and this was the number:, 123',
      'error'
    )
  })

  test('logger.log calls Sentry with the "info" level', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.log('A thing happened, FYI')
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'A thing happened, FYI',
      'info'
    )
  })

  test('logger.log concatenates multiple arguments into a single message', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.log('hi', 'there', 123)
    expect(Sentry.captureMessage).toHaveBeenCalledWith('hi, there, 123', 'info')
  })

  test('logger.debug calls Sentry with the "info" level', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.debug('A thing happened, FYI')
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'A thing happened, FYI',
      'info'
    )
  })

  test('logger.debug concatenates multiple arguments into a single message', () => {
    const logger = require('src/utils/logger').default
    logger.debug('hi', 'there', 123)
    expect(Sentry.captureMessage).toHaveBeenCalledWith('hi, there, 123', 'info')
  })

  test('logger.info calls Sentry with the "info" level', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.info('A thing happened, FYI')
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'A thing happened, FYI',
      'info'
    )
  })

  test('logger.info concatenates multiple arguments into a single message', () => {
    const logger = require('src/utils/logger').default
    logger.info('hi', 'there', 123)
    expect(Sentry.captureMessage).toHaveBeenCalledWith('hi, there, 123', 'info')
  })

  test('logger.warn calls Sentry with the "warning" level', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.warn('A thing happened, FYI')
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'A thing happened, FYI',
      'warning'
    )
  })

  test('logger.warn concatenates multiple arguments into a single message', () => {
    const logger = require('src/utils/logger').default
    logger.warn('hi', 'there', 123)
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      'hi, there, 123',
      'warning'
    )
  })
})

describe('logger: development (console)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_ENABLE_SENTRY_LOGGING = 'false'
  })

  test('logger.error calls console.error with all args', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.error('something bad happened:', 123)
    expect(console.error).toHaveBeenCalledWith('something bad happened:', 123)
  })

  test('logger.debug calls console.debug with all args', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.debug('something bad happened:', 123)
    expect(console.debug).toHaveBeenCalledWith('something bad happened:', 123)
  })

  test('logger.info calls console.info with all args', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.info('something bad happened:', 123)
    expect(console.info).toHaveBeenCalledWith('something bad happened:', 123)
  })

  test('logger.warn calls console.warn with all args', () => {
    expect.assertions(1)
    const logger = require('src/utils/logger').default
    logger.warn('something bad happened:', 123)
    expect(console.warn).toHaveBeenCalledWith('something bad happened:', 123)
  })
})

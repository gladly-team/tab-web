/* eslint-disable  no-console */
import { isError } from 'lodash/lang'
import * as Sentry from '@sentry/node'

const shouldLogToSentry = () => process.env.NODE_ENV === 'production'

const logMessageToSentry = (level, ...args) => {
  const msg = args.join(', ')
  Sentry.captureMessage(msg, level)
}

const logger = {}

logger.log = (...args) => {
  if (shouldLogToSentry()) {
    logMessageToSentry('info', ...args)
  } else {
    console.log(...args)
  }
}

logger.debug = (...args) => {
  if (shouldLogToSentry()) {
    logMessageToSentry('info', ...args)
  } else {
    console.debug(...args)
  }
}

logger.info = (...args) => {
  if (shouldLogToSentry()) {
    logMessageToSentry('info', ...args)
  } else {
    console.info(...args)
  }
}

logger.warn = (...args) => {
  if (shouldLogToSentry()) {
    logMessageToSentry('warning', ...args)
  } else {
    console.warn(...args)
  }
}

logger.error = (...args) => {
  if (shouldLogToSentry()) {
    if (isError(args[0])) {
      Sentry.captureException(args[0])
    } else {
      logMessageToSentry('error', ...args)
    }
  } else {
    console.log('HERE!', ...args)
    console.error(...args)
  }
}

export default logger

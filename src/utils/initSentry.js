import * as Sentry from '@sentry/node'

// Our Webpack config swaps in the browser Sentry package when in
// a browser environment. See this example:
// https://github.com/vercel/next.js/blob/canary/examples/with-sentry/next.config.js#L45
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'

try {
  ensureValuesAreDefined(process.env.NEXT_PUBLIC_SENTRY_DSN)
} catch (e) {
  throw new Error('Environment variable NEXT_PUBLIC_SENTRY_DSN must be set.')
}
let alreadyInit = false

const initSentry = () => {
  if (alreadyInit) {
    return
  }
  alreadyInit = true
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })
}

export default initSentry

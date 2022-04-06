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
    ignoreErrors: [
      // Expected error thrown in _app.js. See:
      // https://github.com/zeit/next.js/issues/2476
      /^routeChange aborted. This error can be safely ignored./,

      // Ignore network errors. Stop ignoring these in the future if we
      // more gracefully handle network failures.
      /^AbortError/,
      /^Network Error/,
      /^NetworkError when attempting to fetch resource.$/,
      /^TypeError: cancelled$/,
      /^TypeError: Failed to fetch$/,

      // This SecurityError occurs on Firefox when localStorage isn't available
      // in the new tab page context. We should handle this but will ignore
      // for now.
      /^SecurityError: The operation is insecure.$/,

      // tab-cmp (unhandled Quantcast rejection)
      /^GVLError/,
    ],
  })
}

export default initSentry

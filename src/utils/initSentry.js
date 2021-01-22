import * as Sentry from '@sentry/node'
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

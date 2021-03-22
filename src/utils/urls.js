import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'

try {
  ensureValuesAreDefined([
    process.env.NEXT_PUBLIC_URLS_BASE_PATH,
    process.env.NEXT_PUBLIC_URLS_API_BASE_PATH,
    process.env.NEXT_PUBLIC_URLS_USE_TRAILING_SLASH,
  ])
} catch (e) {
  throw new Error(
    'Environment variables NEXT_PUBLIC_URLS_BASE_PATH, NEXT_PUBLIC_URLS_API_BASE_PATH, and NEXT_PUBLIC_URLS_USE_TRAILING_SLASH must be set.'
  )
}

// Base path set in Next config. This must match our app's
// CloudFront routing.
const basePath = process.env.NEXT_PUBLIC_URLS_BASE_PATH || ''

// In CloudFront, the /v4 base path routes to this Next.js
// app. The /newtab base paths routes to the this app -OR-
// the legacy static app, depending on cookie settings. Thus,
// to call one of this app's API endpoints to set the cookie
// that opts into this app, we need to use the /v4 endpoint.
const NEXT_PUBLIC_URLS_API_BASE_PATH =
  process.env.NEXT_PUBLIC_URLS_API_BASE_PATH || ''

const useTrailingSlash =
  process.env.NEXT_PUBLIC_URLS_USE_TRAILING_SLASH === 'true'

const addTrailingSlashIfNeeded = (path) => {
  const hasTrailingSlash = path[path.length - 1] === '/'
  return `${path}${!hasTrailingSlash && useTrailingSlash ? '/' : ''}`
}

export const withBasePath = (path) => `${basePath}${path}`

// For /api/* paths.
const createAPIURL = (url) =>
  addTrailingSlashIfNeeded(`${NEXT_PUBLIC_URLS_API_BASE_PATH}${url}`)

const createPageURL = (url) => addTrailingSlashIfNeeded(url)

export const apiLogin = createAPIURL('/api/login')
export const apiLogout = createAPIURL('/api/logout')
export const apiBetaOptIn = createAPIURL('/api/beta-opt-in')

export const accountURL = createPageURL('/account')
export const achievementsURL = createPageURL('/achievements')
export const authURL = createPageURL('/auth')
export const betaOptInURL = createPageURL('/beta-opt-in')
export const dashboardURL = createPageURL('/')

// For progressive web app.
export const PWAManifestURL = withBasePath('/manifest.json')
export const EXTERNAL_CONTACT_US_URL =
  'https://gladly.zendesk.com/hc/en-us/requests/new'
export const HELP_URL = 'https://tab.gladly.io/help/'
// eslint-disable-next-line no-undef
export const reload = () => window.location.reload()
export const externalNavigation = (url) => {
  // eslint-disable-next-line no-undef
  window.location = url
}
export const baseURL = 'https://tab.gladly.io/cats/'
export const getReferralUrl = (username) => {
  const referralUrl = username
    ? `${baseURL}?u=${encodeURIComponent(username)}`
    : baseURL
  return referralUrl
}

// Base path set in Next config. This must match our app's
// CloudFront routing.
// TODO: reenable env var
// const basePath = process.env.URLS_BASE_PATH || ''
const basePath = ''

// In CloudFront, the /v4 base path routes to this Next.js
// app. The /newtab base paths routes to the this app -OR-
// the legacy static app, depending on cookie settings. Thus,
// to call one of this app's API endpoints to set the cookie
// that opts into this app, we need to use the /v4 endpoint.
const URLS_API_BASE_PATH = process.env.URLS_API_BASE_PATH || ''

// A trailing slash in Next is experimental:
// https://github.com/zeit/next.js/issues/5214
// We can use it in production with Vercel routing.
// const URLS_USE_TRAILING_SLASH = process.env.URLS_USE_TRAILING_SLASH === 'true'
const URLS_USE_TRAILING_SLASH = true // TODO: use env vars

const addTrailingSlashIfNeeded = (path) => {
  const hasTrailingSlash = path[path.length - 1] === '/'
  return `${path}${!hasTrailingSlash && URLS_USE_TRAILING_SLASH ? '/' : ''}`
}

export const withBasePath = (path) => `${basePath}${path}`

// For /api/* paths.
const createAPIURL = (url) =>
  addTrailingSlashIfNeeded(`${URLS_API_BASE_PATH}${url}`)

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

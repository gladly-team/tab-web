// This app is on a subpath of a domain that contains other
// apps. In now.json, we rewrite requests from the subpath
// to the root, and in Cloudfront, we pass all requests prefixed
// with this BASE_PATH value or "_next" to the Now server.
// In the future, we can potentially set a "basePath" option
// in Next.js.
// Info on experimental Next.js "basePath":
// https://github.com/zeit/next.js/issues/4998
// https://github.com/zeit/next.js/pull/9872/files
// A Next.js RFC to support custom routes:
// https://github.com/zeit/next.js/issues/9081
const URLS_BASE_PATH = process.env.URLS_BASE_PATH || ''

// In CloudFront, the /v4 base path routes to this Next.js
// app. The /newtab base paths routes to the this app -OR-
// the legacy static app, depending on cookie settings. Thus,
// to call one of this app's API endpoints to set the cookie
// that opts into this app, we need to use the /v4 endpoint.
const URLS_API_BASE_PATH = process.env.URLS_API_BASE_PATH || ''

// The trailing slash doesn't work in development:
// https://github.com/zeit/next.js/issues/5214
// But we want to use it in production.
// const URLS_USE_TRAILING_SLASH = process.env.URLS_USE_TRAILING_SLASH === 'true'
const URLS_USE_TRAILING_SLASH = false

const addTrailingSlashIfNeeded = (path) => {
  const hasTrailingSlash = path[path.length - 1] === '/'
  return `${path}${!hasTrailingSlash && URLS_USE_TRAILING_SLASH ? '/' : ''}`
}

export const withBasePath = (path) => `${URLS_BASE_PATH}${path}`

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

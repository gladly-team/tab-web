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

// The trailing slash doesn't work in development:
// https://github.com/zeit/next.js/issues/5214
// But we want to use it in production.
const URLS_USE_TRAILING_SLASH = process.env.URLS_USE_TRAILING_SLASH === 'true'

const withBasePath = path => {
  const hasTrailingSlash = path[path.length - 1] === '/'
  return `${URLS_BASE_PATH}${path}${
    !(hasTrailingSlash && URLS_USE_TRAILING_SLASH) ? '/' : ''
  }`
}

export const apiLogin = withBasePath('/api/login')
export const apiLogout = withBasePath('/api/logout')

export const authURL = withBasePath('/auth')
export const dashboardURL = withBasePath('/')
export const exampleURL = withBasePath('/example')

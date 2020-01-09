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
const BASE_PATH = process.env.BASE_PATH || ''

const withBasePath = path => `${BASE_PATH}${path}`

export const apiLogin = withBasePath('/api/login')
export const apiLogout = withBasePath('/api/logout')

export const authURL = withBasePath('/auth')
export const dashboardURL = withBasePath('/')
export const exampleURL = withBasePath('/example')

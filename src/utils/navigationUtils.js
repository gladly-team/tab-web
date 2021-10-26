import { isServerSide } from 'src/utils/ssr'

/* globals window */
export const isAbsoluteURL = (url) =>
  !!(url.startsWith('http://') || url.startsWith('https://'))

// Base path set in Next config. This must match our app's
// CloudFront routing.
const basePath = process.env.NEXT_PUBLIC_URLS_BASE_PATH || ''

export const withBasePath = (url) =>
  isAbsoluteURL(url) ? url : `${basePath}${url}`

/**
 * Determine whether a URL is for a different app from the current
 * URL. In other words, navigating to the new URL cannot simply
 * navigate within a single-page app.
 * @param {String} newURL - The URL to test
 * @return {Boolean} Whether the new URL is for another app
 */
export const isURLForDifferentApp = (newURL) => {
  const newURLObj = new URL(newURL, window.location.origin)

  // If the URLs are on different domains, they're different apps.
  if (newURLObj.hostname !== window.location.hostname) {
    return true
  }

  // If the new URL is not on the "newtab" subpath, it is a
  // different app.
  const APP_SUBPATH = 'newtab'
  const newURLFirstSubpath = newURLObj.pathname.split('/')[1]
  return newURLFirstSubpath !== APP_SUBPATH
}

const addTrailingSlashIfNeeded = (path) => {
  const hasTrailingSlash = path[path.length - 1] === '/'
  return `${path}${!hasTrailingSlash ? '/' : ''}`
}

/**
 * Determine whether two URLs are for the equivalent destination,
 * ignoring absolute vs. relative or differences in trailing
 * slashes. Always returns false server-side.
 * @param {String} urlA - One URL or pathname to test
 * @param {String} urlA - One URL or pathname to test
 * @return {Boolean} Whether the URLs are equivalent
 */
export const areSameURLs = (urlA, urlB) => {
  // Always return false on the server-side because we don't
  // necessarily have acesss to the domain.
  if (isServerSide()) {
    return false
  }
  const urlAAbs = new URL(
    addTrailingSlashIfNeeded(urlA),
    window.location.origin
  ).href
  const urlBAbs = new URL(
    addTrailingSlashIfNeeded(urlB),
    window.location.origin
  ).href
  return urlAAbs === urlBAbs
}

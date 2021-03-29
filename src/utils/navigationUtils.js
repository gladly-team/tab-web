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

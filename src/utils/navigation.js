/* globals window */
import Router from 'next/router'
import { isServerSide } from 'src/utils/ssr'
import { withBasePath } from 'src/utils/urls'

// Handle redirects on both the client side and server side.
// Adapted from:
// https://github.com/zeit/next.js/issues/649#issuecomment-426552156
export const redirect = ({ location, ctx = null, status = 302 }) => {
  if (!location) {
    throw new Error(
      'The `redirect` function must include a "location" argument.'
    )
  }
  if (isServerSide()) {
    if (!ctx || !ctx.res) {
      throw new Error(
        'The `redirect` function requires a "ctx" argument (the argument passed to Next.js pages) when called server-side.'
      )
    }
    ctx.res.writeHead(status, {
      // Server-side redirects require the subpath under which we're running this app.
      Location: withBasePath(location),
      'Content-Type': 'text/html; charset=utf-8',
    })
    ctx.res.end()
  } else {
    Router.replace(location)
  }
}

// Note that this currently won't work with external URLs.
// Like Router.push but handling the basePath workaround.
export const goTo = (location) => {
  Router.push(location)
}

// Call window.location.
// Note that this may cause problems if we navigate to
// external URLs while in the new tab page iframe.
export const setWindowLocation = (location, { addBasePath = true } = {}) => {
  if (isServerSide()) {
    throw new Error(
      'The `setWindowLocation` function cannot be called server-side.'
    )
  } else {
    // The Next.js router handles the base path automatically, but
    // we typically need to add it manually here.
    const finalLocation = addBasePath ? withBasePath(location) : location
    window.location = finalLocation
  }
}

export const windowOpenTop = (location) => {
  window.open(location, '_top')
}

export const getHostname = () => window.location.hostname

export const getCurrentURL = () => window.location.href

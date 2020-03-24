/* globals window */
import Router from 'next/router'
import { isServerSide } from 'src/utils/ssr'
import { withBasePath } from 'src/utils/urls'

// Handle redirects on both the client side and server side.
// Adapted from:
// https://github.com/zeit/next.js/issues/649#issuecomment-426552156
export const redirect = ({ location, ctx = null, status = 302 }) => {
  const locationWithBasePath = withBasePath(location)
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
      Location: locationWithBasePath,
      'Content-Type': 'text/html; charset=utf-8',
    })
    ctx.res.end()
  } else {
    // We set the "as" parameter as a  workaround for the missing "basePath"
    // functionality:
    // https://github.com/zeit/next.js/issues/4998#issuecomment-520888814
    // @area/workaround/next-js-base-path
    Router.replace(location, locationWithBasePath)
  }
}

// Like Router.push but handling the basePath workaround.
export const goTo = location => {
  const locationWithBasePath = withBasePath(location)

  // We set the "as" parameter as a  workaround for the missing "basePath"
  // functionality:
  // https://github.com/zeit/next.js/issues/4998#issuecomment-520888814
  // @area/workaround/next-js-base-path
  Router.push(location, locationWithBasePath)
}

// Call window.location.
export const setWindowLocation = location => {
  if (isServerSide()) {
    throw new Error(
      'The `setWindowLocation` function cannot be called server-side.'
    )
  } else {
    // @area/workaround/next-js-base-path
    const locationWithBasePath = withBasePath(location)
    window.location = locationWithBasePath
  }
}

export const getHostname = () => window.location.hostname

export const getCurrentURL = () => window.location.href

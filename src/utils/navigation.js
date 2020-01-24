/* eslint import/prefer-default-export: 0 */
import { isServerSide } from 'src/utils/ssr'

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
      Location: location,
      'Content-Type': 'text/html; charset=utf-8',
    })
    ctx.res.end()
  } else {
    const Router = require('next/router').default // eslint-disable-line global-require
    Router.replace(location)
  }
}

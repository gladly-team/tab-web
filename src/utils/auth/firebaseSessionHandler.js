/* eslint import/prefer-default-export: 0 */

// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-firebase-authentication/pages/index.js

import fetch from 'isomorphic-unfetch'
import { apiLogin, apiLogout } from 'src/utils/urls'

export const setSession = async user => {
  const userToken = await user.getIdToken()

  // If the user is authed, call login to set a cookie.
  if (user) {
    return fetch(apiLogin, {
      method: 'POST',
      // eslint-disable-next-line no-undef
      headers: new Headers({
        Authorization: userToken,
      }),
      credentials: 'omit',
    })
  }

  // If the user is not authed, call logout to unset the cookie.
  return fetch(apiLogout, {
    method: 'POST',
    // eslint-disable-next-line no-undef
    headers: new Headers({
      Authorization: userToken,
    }),
    credentials: 'omit',
  })
}

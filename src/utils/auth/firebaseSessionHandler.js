/* eslint import/prefer-default-export: 0 */

// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-firebase-authentication/pages/index.js

import fetch from 'isomorphic-unfetch'
import { apiLogin, apiLogout } from 'src/utils/urls'

export const setSession = async user => {
  // Log in.
  if (user) {
    return user.getIdToken().then(token => {
      return fetch(apiLogin, {
        method: 'POST',
        // eslint-disable-next-line no-undef
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'include',
        body: JSON.stringify({ token }),
      })
    })
  }

  // Log out.
  return fetch(apiLogout, {
    method: 'POST',
    credentials: 'include',
  })
}

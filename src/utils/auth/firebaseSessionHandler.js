/* eslint import/prefer-default-export: 0 */

// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-firebase-authentication/pages/index.js

import fetch from 'isomorphic-unfetch'
import { apiLogin, apiLogout } from 'src/utils/urls'

export const setSession = async ({ shouldLogin, user }) => {
  if (!user) {
    throw new Error('The setSession function requires a valid "user" value.')
  }
  const userToken = await user.getIdToken()

  // If the user is still authed, call login to set a cookie.
  if (shouldLogin) {
    await fetch(apiLogin, {
      method: 'POST',
      // eslint-disable-next-line no-undef
      headers: new Headers({
        Authorization: userToken,
      }),
      credentials: 'include',
    })
    return
  }

  // If the user is logging out, call logout to unset the cookie.
  await fetch(apiLogout, {
    method: 'POST',
    // eslint-disable-next-line no-undef
    headers: new Headers({
      Authorization: userToken,
    }),
    credentials: 'include',
  })
}

import { init } from 'next-firebase-auth'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import { apiLogin, apiLogout, authURL, dashboardURL } from 'src/utils/urls'
import { CUSTOM_HEADER_NAME } from 'src/utils/middleware/constants'
import logger from 'src/utils/logger'
import { setCookie } from 'cookies-next'

try {
  ensureValuesAreDefined([
    process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  ])
} catch (e) {
  throw new Error(
    'One or more of the Firebase environment variables is not set.'
  )
}

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
const useSecureSameSiteNone =
  process.env.COOKIE_SECURE_SAME_SITE_NONE === 'true'
const tokenChangedHandler = async (authUser) => {
  let response

  // If the user is authed, call login to set a cookie.
  if (authUser.id) {
    const userToken = await authUser.getIdToken()

    // This is used by v5 of our app as cloudfront does not support cookies with dots in them.
    const currentDate = new Date()
    const nextYearDate = new Date(currentDate)
    nextYearDate.setFullYear(currentDate.getFullYear() + 1)
    setCookie('TabAuthToken', userToken, { expires: nextYearDate })

    response = await fetch(apiLogin, {
      method: 'POST',
      headers: {
        Authorization: userToken,
        [CUSTOM_HEADER_NAME]: 'tabV4',
      },
      credentials: 'include',
    })
    if (!response.ok) {
      const responseJSON = await response.json()
      logger.error(
        new Error(
          `Received ${
            response.status
          } response from login API endpoint: ${JSON.stringify(responseJSON)}`
        )
      )
    }
  } else {
    // If the user is not authed, call logout to unset the cookie.
    response = await fetch(apiLogout, {
      method: 'POST',
      credentials: 'include',
      headers: {
        [CUSTOM_HEADER_NAME]: 'tabV4',
      },
    })
    if (!response.ok) {
      const responseJSON = await response.json()
      logger.error(
        new Error(
          `Received ${
            response.status
          } response from logout API endpoint: ${JSON.stringify(responseJSON)}`
        )
      )
    }
  }
  return response
}

const initAuth = () => {
  init({
    authPageURL: authURL,
    appPageURL: dashboardURL,

    tokenChangedHandler,
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,

        // Our approach:
        // https://github.com/vercel/vercel/issues/749#issuecomment-707515089
        // Another potential approach:
        // https://stackoverflow.com/a/41044630/1332513
        privateKey: firebasePrivateKey
          ? JSON.parse(firebasePrivateKey)
          : undefined,
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    onVerifyTokenError: (err) => {
      logger.error(err)
    },
    onTokenRefreshError: (err) => {
      logger.error(err)
    },
    cookies: {
      name: 'TabAuth',
      keys: [
        process.env.COOKIE_SECRET_20220711,
        process.env.COOKIE_SECRET_CURRENT,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',

      // Important that production serves sameSite=None and secure=true
      // because we may load this page as an iframe on the new tab page
      // (cross-domain).
      sameSite: useSecureSameSiteNone ? 'none' : 'strict',
      secure: useSecureSameSiteNone,
      signed: true,
    },
  })
}

export default initAuth

import { init } from 'next-firebase-auth'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import { apiLogin, apiLogout, authURL, dashboardURL } from 'src/utils/urls'

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
  process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE === 'true'

const initAuth = () => {
  init({
    authPageURL: authURL,
    appPageURL: dashboardURL,
    loginAPIEndpoint: apiLogin,
    logoutAPIEndpoint: apiLogout,
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
        // https://github.com/vercel/vercel/issues/749#issuecomment-707515089
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
    cookies: {
      name: 'TabAuth', // required
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      // Important that production serves sameSite=None and secure=true because we
      // may load this page as an iframe on the new tab page (cross-domain).
      // The 'none' option is supported in cookie-session ^1.4.0.
      sameSite: useSecureSameSiteNone ? 'none' : 'strict',
      secure: useSecureSameSiteNone,
      signed: true,
    },
  })
}

export default initAuth

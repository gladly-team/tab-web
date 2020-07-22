import Cookies from 'cookies'
import logger from 'src/utils/logger'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'

try {
  ensureValuesAreDefined(process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE)
} catch (e) {
  throw new Error(
    'Environment variable SESSION_COOKIE_SECURE_SAME_SITE_NONE must be set.'
  )
}

// Adds a req.cookie object, which has get/set methods.
export const withCookies = (req, res) => {
  // Ensure that session secrets are set.
  if (
    !(process.env.SESSION_SECRET_CURRENT && process.env.SESSION_SECRET_PREVIOUS)
  ) {
    throw new Error(
      'Session secrets must be set as env vars `SESSION_SECRET_CURRENT` and `SESSION_SECRET_PREVIOUS`.'
    )
  }

  // An array is useful for rotating secrets without invalidating old sessions.
  // The first will be used to sign cookies, and the rest to validate them.
  // https://github.com/expressjs/cookie-session#keys
  const sessionSecrets = [
    process.env.SESSION_SECRET_CURRENT,
    process.env.SESSION_SECRET_PREVIOUS,
  ]

  const useSecureSameSiteNone =
    process.env.SESSION_COOKIE_SECURE_SAME_SITE_NONE === 'true'

  // https://github.com/pillarjs/cookies
  try {
    const cookies = Cookies(req, res, {
      // "A Keygrip object or an array of keys can optionally be passed as options.keys
      // to enable cryptographic signing based on SHA1 HMAC, using rotated credentials."
      // https://github.com/pillarjs/cookies#cookies--new-cookies-request-response--options--
      keys: sessionSecrets,
      // Important that production serves sameSite=None and secure=true because we
      // may load this page as an iframe on the new tab page (cross-domain).
      // "A Boolean can optionally be passed as options.secure to explicitly specify
      // if the connection is secure, rather than this module examining request."
      // https://github.com/pillarjs/cookies#cookies--new-cookies-request-response--options--
      secure: useSecureSameSiteNone,
    })

    req.cookie = {
      get: (cookieName) => {
        return cookies.get(cookieName, {
          signed: true,
        })
      },
      set: (cookieName, cookieVal, options = {}) => {
        cookies.set(cookieName, cookieVal, {
          httpOnly: true,
          maxAge: 604800000, // week
          overwrite: true,
          ...options,
          // Important that production serves sameSite=None and secure=true because we
          // may load this page as an iframe on the new tab page (cross-domain).
          // The 'none' option is supported in cookie-session ^1.4.0.
          sameSite: useSecureSameSiteNone ? 'none' : 'strict',
          secure: useSecureSameSiteNone,
        })
      },
    }
  } catch (e) {
    logger.error(e)
    throw e
  }
}

export default (handler) => (req, res) => {
  try {
    withCookies(req, res)
  } catch (e) {
    logger.error(e)
    return res
      .status(500)
      .json({ error: 'Could not add the cookies middleware.' })
  }
  return handler(req, res)
}

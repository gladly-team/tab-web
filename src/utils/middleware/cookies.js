import Cookies from 'cookies'

// Adds a req.cookies function, which has get/set methods.
export const addCookies = (req, res) => {
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
      httpOnly: true,
      keys: sessionSecrets,
      maxAge: 604800000, // week
      overwrite: true,
      // Important that production serves sameSite=None and secure=true because we
      // may load this page as an iframe on the new tab page (cross-domain).
      // The 'none' option is supported in cookie-session ^1.4.0.
      sameSite: useSecureSameSiteNone ? 'none' : 'strict',
      secure: useSecureSameSiteNone,
    })
    req.cookies = cookies
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
    throw e
  }
}

export default handler => (req, res) => {
  try {
    addCookies(req, res)
  } catch (e) {
    return res
      .status(500)
      .json({ error: 'Could not add the cookies middleware.' })
  }
  return handler(req, res)
}

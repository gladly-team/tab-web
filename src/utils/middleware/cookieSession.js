import cookieSession from 'cookie-session'

export const addSession = (req, res) => {
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

  // Example:
  // https://github.com/billymoon/micro-cookie-session
  const includeSession = cookieSession({
    // https://github.com/expressjs/cookie-session#cookie-options
    name: 'tabWebSession',
    httpOnly: true,
    keys: sessionSecrets,
    maxAge: 604800000, // week
    overwrite: true,
    // Important that sameSite=None because we may load this page as
    // an iframe on the new tab page (cross-domain).
    sameSite: 'none',
    secure: true,
  })
  includeSession(req, res, () => {})
}

export default handler => (req, res) => {
  try {
    addSession(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Could not get user session.' })
  }
  return handler(req, res)
}

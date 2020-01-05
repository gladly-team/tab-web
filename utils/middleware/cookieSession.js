import cookieSession from 'cookie-session'

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

export default handler => (req, res) => {
  const addSession = cookieSession({
    name: 'tabWebSession',
    keys: sessionSecrets,
    // TODO: set other options, such as "secure", "sameSite", etc.
    // https://github.com/expressjs/cookie-session#cookie-options
    maxAge: 604800000, // week
    httpOnly: true,
    overwrite: true,
  })

  // Example:
  // https://github.com/billymoon/micro-cookie-session
  addSession(req, res, () => {})
  return handler(req, res)
}

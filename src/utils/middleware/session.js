import { withCookies } from 'src/utils/middleware/cookies'

const addSession = (req, res) => {
  if (!req.cookie) {
    throw new Error('The session middleware requires the cookies middleware.')
  }
  const sessionCookieName = 'tabWebSession'

  try {
    // Session getter/setter. Adapted from:
    // https://github.com/expressjs/cookie-session/blob/master/index.js
    Object.defineProperty(req, 'session', {
      configurable: true,
      enumerable: true,
      get: () => req.cookie.get(sessionCookieName),
      set: val => {
        req.cookie.set(sessionCookieName, val)
      },
    })
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
    throw e
  }
}

export const withSession = (req, res) => {
  withCookies(req, res)
  addSession(req, res)
}

export default handler => (req, res) => {
  try {
    withSession(req, res)
  } catch (e) {
    // TODO: log error
    console.error(e) // eslint-disable-line no-console
    return res.status(500).json({ error: 'Could not get user session.' })
  }
  return handler(req, res)
}

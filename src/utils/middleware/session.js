import { isNil } from 'lodash/lang'
import { encodeBase64, decodeBase64 } from 'src/utils/encoding'
import { withCookies } from 'src/utils/middleware/cookies'

const addSession = req => {
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
      get: () => {
        let decodedVal
        try {
          decodedVal = decodeBase64(req.cookie.get(sessionCookieName))
          return decodedVal
        } catch (e) {
          return undefined
        }
      },
      set: val => {
        let encodedVal
        try {
          // If the value is not defined, set the value to undefined
          // so that the cookie will be deleted.
          if (isNil(val)) {
            encodedVal = undefined
          } else {
            encodedVal = encodeBase64(val)
          }
        } catch (e) {
          // TODO: log error
          console.error(e) // eslint-disable-line no-console
          return
        }
        req.cookie.set(sessionCookieName, encodedVal)
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

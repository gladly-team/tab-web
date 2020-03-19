import { isNil } from 'lodash/lang'
import { encodeBase64, decodeBase64 } from 'src/utils/encoding'
import { withCookies } from 'src/utils/middleware/cookies'

// Session adapted from:
// https://github.com/expressjs/cookie-session/blob/master/index.js
function Session(req) {
  this.req = req
  this.cookieName = 'tabWebSession'

  const serialize = val => encodeBase64(val)
  const deserialize = val => decodeBase64(val)

  // Compare a new serialized value to the existing value.
  const isDifferent = newSerializedVal => {
    const existingSession = this.get()
    const existingSessionSerialized = isNil(existingSession)
      ? undefined
      : serialize(existingSession)
    return newSerializedVal !== existingSessionSerialized
  }

  this.get = () => {
    let deserializedVal
    try {
      deserializedVal = deserialize(this.req.cookie.get(this.cookieName))
      return deserializedVal
    } catch (e) {
      return undefined
    }
  }

  this.set = val => {
    let serializedVal
    try {
      // If the value is not defined, set the value to undefined
      // so that the cookie will be deleted.
      if (isNil(val)) {
        serializedVal = undefined
      } else {
        serializedVal = serialize(val)
      }
    } catch (e) {
      // TODO: log error
      console.error(e) // eslint-disable-line no-console
      return
    }

    // TODO: remove this optimization
    // Only set the cookie if it has changed.
    if (isDifferent(serializedVal)) {
      this.req.cookie.set(this.cookieName, serializedVal)
    }
  }
}

const addSession = req => {
  if (!req.cookie) {
    throw new Error('The session middleware requires the cookies middleware.')
  }

  try {
    const session = new Session(req)
    Object.defineProperty(req, 'session', {
      configurable: true,
      enumerable: true,
      get: session.get,
      set: session.set,
    })
  } catch (e) {
    // TODO: log error
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

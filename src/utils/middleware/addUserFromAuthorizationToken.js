import { verifyIdToken } from 'next-firebase-auth'
import { get, set } from 'lodash/object'
import logger from 'src/utils/logger'
import {
  CUSTOM_REQ_DATA_KEY,
  AUTH_USER_KEY,
} from 'src/utils/middleware/constants'

// Adds a tab.user property to the `req` object.
const addUserFromAuthorizationToken = (handler) => async (req, res) => {
  try {
    const authorizationHeaderVal = get(req, 'headers.authorization')
    if (!authorizationHeaderVal) {
      return res.status(403).json({ error: 'Invalid authorization header.' })
    }
    let AuthUser
    try {
      AuthUser = await verifyIdToken(authorizationHeaderVal)
    } catch (e) {
      return res.status(403).json({ error: 'Invalid authorization header.' })
    }
    set(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_KEY], AuthUser)
  } catch (e) {
    logger.error(e)
    return res
      .status(500)
      .json({ error: 'Could not get the user from the Authorization header.' })
  }
  return handler(req, res)
}

export default addUserFromAuthorizationToken

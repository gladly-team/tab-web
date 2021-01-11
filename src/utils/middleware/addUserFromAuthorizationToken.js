import { get } from 'lodash/object'
import logger from 'src/utils/logger'

// FIXME: use next-firebase-auth

// Adds a tab.user object to the request.
export default (handler) => async (req, res) => {
  try {
    const authorizationHeaderVal = get(req, 'headers.authorization')
    if (!authorizationHeaderVal) {
      return res.status(403).json({ error: 'Invalid authorization header.' })
    }
    // let AuthUser
    try {
      // TODO
    } catch (e) {
      return res.status(403).json({ error: 'Invalid authorization header.' })
    }
    // set(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_KEY], AuthUser)
  } catch (e) {
    logger.error(e)
    return res
      .status(500)
      .json({ error: 'Could not get the user from the Authorization header.' })
  }
  return handler(req, res)
}

import { get, set } from 'lodash/object'
import { verifyIdToken } from 'src/utils/auth/firebaseAdmin'
import { createAuthUserInfo } from 'src/utils/auth/user'
import {
  CUSTOM_REQ_DATA_KEY,
  AUTH_USER_INFO_KEY,
} from 'src/utils/middleware/constants'

// Adds a tab.user object to the request.
export default handler => async (req, res) => {
  try {
    const authorizationHeaderVal = get(req, 'headers.authorization')
    if (!authorizationHeaderVal) {
      return res.status(403).json({ error: 'Invalid authorization header.' })
    }
    let firebaseUser
    try {
      firebaseUser = await verifyIdToken(authorizationHeaderVal)
    } catch (e) {
      // TODO: log error
      return res.status(403).json({ error: 'Invalid authorization header.' })
    }
    const authUserInfo = createAuthUserInfo({
      firebaseUser,
      token: authorizationHeaderVal,
    })
    set(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_INFO_KEY], authUserInfo)
  } catch (e) {
    // TODO: log error
    return res
      .status(500)
      .json({ error: 'Could not get the user from the Authorization header.' })
  }
  return handler(req, res)
}

import { get } from 'lodash/object'
import {
  CUSTOM_REQ_DATA_KEY,
  AUTH_USER_KEY,
} from 'src/utils/middleware/constants'

// Require an authorized user to invoke `handler`.
const authProtected = (handler) => async (req, res) => {
  const AuthUser = get(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_KEY])
  if (!(AuthUser && AuthUser.id)) {
    return res.status(400).json({ error: 'Not authorized.' })
  }
  return handler(req, res)
}

export default authProtected

import { get } from 'lodash/object'
import {
  CUSTOM_REQ_DATA_KEY,
  AUTH_USER_INFO_KEY,
} from 'src/utils/middleware/constants'

// Requires an authorized user.
export default (handler) => async (req, res) => {
  const AuthUserInfo = get(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_INFO_KEY])
  const { AuthUser, token } = AuthUserInfo
  if (!(token && AuthUser && AuthUser.id)) {
    return res.status(400).json({ success: false })
  }
  return handler(req, res)
}

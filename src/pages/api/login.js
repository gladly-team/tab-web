import { get } from 'lodash/object'
import commonAPIMiddleware from 'src/utils/middleware/APIMiddleware/commonAPIMiddleware'
import {
  CUSTOM_REQ_DATA_KEY,
  AUTH_USER_INFO_KEY,
} from 'src/utils/middleware/constants'

const handler = (req, res) => {
  const AuthUserInfo = get(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_INFO_KEY])
  const { AuthUser, token } = AuthUserInfo
  if (!(token && AuthUser && AuthUser.id)) {
    return res.status(400).json({ success: false })
  }

  req.session = {
    ...(req.session || {}),
    AuthUserInfo,
  }
  return res.status(200).json({ success: true })
}

export default commonAPIMiddleware(handler)

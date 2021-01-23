import { flowRight } from 'lodash/util'
import addUserFromAuthorizationToken from 'src/utils/middleware/addUserFromAuthorizationToken'
import authProtected from 'src/utils/middleware/authProtected'
// import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'
import onlyPostRequests from 'src/utils/middleware/onlyPostRequests'
import { setAuthCookies } from 'next-firebase-auth'
import initAuth from 'src/utils/auth/initAuth'
import logger from 'src/utils/logger'

initAuth()

const handler = async (req, res) => {
  try {
    await setAuthCookies(req, res)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ success: true })
}

export default flowRight([
  onlyPostRequests,
  // FIXME: require custom header (need to modify next-firebase-auth)
  // customHeaderRequired,
  addUserFromAuthorizationToken,
  authProtected,
])(handler)

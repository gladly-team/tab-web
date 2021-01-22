import { flowRight } from 'lodash/util'
// import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'
import { unsetAuthCookies } from 'next-firebase-auth'
import initAuth from 'src/utils/auth/initAuth'
import logger from 'src/utils/logger'

initAuth()

const handler = async (req, res) => {
  try {
    await unsetAuthCookies(req, res)
  } catch (e) {
    logger.error(e)
    return res.status(500).json({ error: 'Unexpected error.' })
  }
  return res.status(200).json({ success: true })
}

// FIXME: require custom header (need to modify next-firebase-auth)
// Endpoint does not require the user to be authenticated. See:
// https://github.com/gladly-team/tab-web#authentication-approach
export default flowRight([
  // customHeaderRequired
])(handler)

import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'

const logout = async (AuthUser) => {
  try {
    await AuthUser.signOut()

    // Clear the cache so it does not contain any authed content.
    await clearAllServiceWorkerCaches()
    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}

export default logout

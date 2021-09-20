import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'
import localStorageMgr from 'src/utils/localstorage-mgr'
import { STORAGE_KEY_USERNAME } from 'src/utils/constants'

const logout = async (AuthUser) => {
  try {
    await AuthUser.signOut()

    // Clear the cache so it does not contain any authed content.
    await clearAllServiceWorkerCaches()
    await localStorageMgr.removeItem(STORAGE_KEY_USERNAME)
    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}

export default logout

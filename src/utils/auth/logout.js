import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'
import { deleteCookie } from 'cookies-next'
import localStorageMgr from 'src/utils/localstorage-mgr'
import { STORAGE_KEY_USERNAME } from 'src/utils/constants'

const logout = async (AuthUser) => {
  try {
    // Clear the cache so it does not contain any authed content.
    await clearAllServiceWorkerCaches()
    await localStorageMgr.removeItem(STORAGE_KEY_USERNAME)

    // Clear cookie for tabV4OptIn
    await deleteCookie('tabV4OptIn')

    // Must do this last, as it will cause the page to reload.
    await AuthUser.signOut()

    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}

export default logout

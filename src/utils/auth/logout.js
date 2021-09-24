import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'
import localStorageMgr from 'src/utils/localstorage-mgr'

const logout = async (AuthUser) => {
  try {
    // Clear the cache and local data so it does not contain any
    // authed content.
    await clearAllServiceWorkerCaches()
    localStorageMgr.clear()

    // Do the above first, because signing out will trigger a redirect
    // to the auth page via next-firebase-auth.
    await AuthUser.signOut()
    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}

export default logout

import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'
import { authURL } from 'src/utils/urls'
import { setWindowLocation } from 'src/utils/navigation'

const logout = async (AuthUser) => {
  try {
    await AuthUser.signOut()

    // Clear the cache so it does not contain any authed content.
    await clearAllServiceWorkerCaches()

    // We use Tab Legacy for authentication logic, so make sure
    // to hard-refresh rather than navigate within this app.
    // Remove when we want to use this app for auth. See:
    // https://github.com/gladly-team/tab/pull/891
    setWindowLocation(authURL)

    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}

export default logout

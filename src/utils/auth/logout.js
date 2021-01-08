import firebase from 'firebase/app'
import 'firebase/auth'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { destroyAuthUserInfoInDOM } from 'src/utils/auth/user'
import logger from 'src/utils/logger'

const logout = async () => {
  try {
    await firebase.auth().signOut()

    // Sign-out successful.
    destroyAuthUserInfoInDOM()

    // Clear the cache so it does not contain any authed content.
    await clearAllServiceWorkerCaches()
    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}

export default logout

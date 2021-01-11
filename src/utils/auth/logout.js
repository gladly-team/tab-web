import firebase from 'firebase/app'
import 'firebase/auth'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import logger from 'src/utils/logger'

const logout = async () => {
  try {
    // TODO: use next-firebase-auth
    await firebase.auth().signOut()

    // Clear the cache so it does not contain any authed content.
    await clearAllServiceWorkerCaches()
    return true
  } catch (e) {
    logger.error(e)
    return false
  }
}

export default logout

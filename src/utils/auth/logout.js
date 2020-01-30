import firebase from 'firebase/app'
import 'firebase/auth'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { destroyAuthUserInfoInDOM } from 'src/utils/auth/user'

export default async () => {
  try {
    await firebase.auth().signOut()

    // Sign-out successful.
    destroyAuthUserInfoInDOM()

    // Clear the cache so it does not contain any authed content.
    await clearAllServiceWorkerCaches()
    return true
  } catch (e) {
    console.error(e) // eslint-disable-line no-console

    // TODO: log error instead of throwing
    throw e
  }
}

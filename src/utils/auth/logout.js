import firebase from 'firebase/app'
import 'firebase/auth'
import { destroyAuthUserInfoInDOM } from 'src/utils/auth/user'

export default async () => {
  return firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      destroyAuthUserInfoInDOM()
      return true
    })
    .catch(e => {
      console.error(e) // eslint-disable-line no-console

      // TODO: log error instead of throwing
      throw e
    })
}

/* eslint import/prefer-default-export: 0 */
import { get, has } from 'lodash/object'

/**
 * Take the user object from Firebase (from either the Firebase admin SDK or
 * or the client-side Firebase JS SDK) and return a consistent AuthUser object.
 * @return {Object|null} AuthUser - The user object.
 * @return {String} AuthUser.id - The user's ID
 * @return {String} AuthUser.email - The user's email
 * @return {Boolean} AuthUser.emailVerified - Whether the user has verified their email
 */
export const createAuthUser = firebaseUserObj => {
  if (!firebaseUserObj || !firebaseUserObj.uid) {
    return null
  }
  return {
    id: get(firebaseUserObj, 'uid'),
    email: get(firebaseUserObj, 'email'),
    emailVerified: has(firebaseUserObj, 'emailVerified')
      ? get(firebaseUserObj, 'emailVerified') // Firebase JS SDK
      : get(firebaseUserObj, 'email_verified'), // Firebase admin SDK
  }
}

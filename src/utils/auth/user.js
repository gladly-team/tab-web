/* eslint import/prefer-default-export: 0 */
/* globals window */
import { get, has } from 'lodash/object'
import { isServerSide } from 'src/utils/ssr'

/**
 * Take the user object from Firebase (from either the Firebase admin SDK or
 * or the client-side Firebase JS SDK) and return a consistent AuthUser object.
 * @param {Object} firebaseUser - A decoded Firebase user token or JS SDK
 *   Firebase user object.
 * @return {Object|null} AuthUser - The user object.
 * @return {String} AuthUser.id - The user's ID
 * @return {String} AuthUser.email - The user's email
 * @return {Boolean} AuthUser.emailVerified - Whether the user has verified their email
 */
export const createAuthUser = firebaseUser => {
  if (!firebaseUser || !firebaseUser.uid) {
    return null
  }
  return {
    id: get(firebaseUser, 'uid'),
    email: get(firebaseUser, 'email'),
    emailVerified: has(firebaseUser, 'emailVerified')
      ? get(firebaseUser, 'emailVerified') // Firebase JS SDK
      : get(firebaseUser, 'email_verified'), // Firebase admin SDK
  }
}

/**
 * Create an object with an AuthUser object and AuthUserToken value.
 * @param {Object} firebaseUser - A decoded Firebase user token or JS SDK
 *   Firebase user object.
 * @param {String} firebaseToken - A Firebase auth token string.
 * @return {Object|null} AuthUserInfo - The auth user info object.
 * @return {String} AuthUserInfo.AuthUser - An AuthUser object (see
 *   `createAuthUser` above).
 * @return {String} AuthUser.token - The user's encoded Firebase token.
 */
export const createAuthUserInfo = ({
  firebaseUser = null,
  token = null,
} = {}) => {
  return {
    AuthUser: createAuthUser(firebaseUser),
    token,
  }
}

// The ID of the script in which we store the AuthUserInfo JSON. See:
// https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
export const authUserInfoDOMScriptId = '__TAB_WEB_AUTH_USER_INFO'

/**
 * Get the AuthUserInfo from stored data. We store it in _document.js. See:
 * https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
 * @return {Object|null} AuthUserInfo - The auth user info object.
 * @return {String} AuthUserInfo.AuthUser - An AuthUser object (see
 *   `createAuthUser` above).
 * @return {String} AuthUser.token - The user's encoded Firebase token.
 */
export const getAuthUserInfoFromDOM = () => {
  // This function should not be called server-side.
  if (isServerSide()) {
    throw new Error(
      'The `getAuthUserInfoFromDOM` cannot be called server-side.'
    )
  }
  let AuthUserInfo = createAuthUserInfo() // default to empty
  try {
    AuthUserInfo = JSON.parse(
      window.document.getElementById(authUserInfoDOMScriptId).textContent
    )
  } catch (e) {
    // TODO: log error
    console.error(e) // eslint-disable-line no-console
  }
  return AuthUserInfo
}

/**
 * Set the AuthUserInfo value in the stored DOM JSON. This is useful for when
 * the user authenticates and navigates to another page that requires authentication
 * and would redirect without the AuthUserInfo.
 * @param {Object|null} AuthUserInfo - The auth user info object.
 * @param {String} AuthUserInfo.AuthUser - An AuthUser object (see
 *   `createAuthUser` above).
 * @param {String} AuthUser.token - The user's encoded Firebase token.
 * @return {undefined}
 */
export const setAuthUserInfoInDOM = AuthUserInfo => {
  // This function should not be called server-side.
  if (isServerSide()) {
    throw new Error('The `setAuthUserInfoInDOM` cannot be called server-side.')
  }
  // TODO: may want to validate the AuthUserInfo
  try {
    window.document.getElementById(
      authUserInfoDOMScriptId
    ).textContent = JSON.stringify(AuthUserInfo)
  } catch (e) {
    // TODO: log error
    console.error(e) // eslint-disable-line no-console
  }
}

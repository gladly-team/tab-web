/* global window */
import { STORAGE_NEW_USER_CAUSE_ID } from './constants'

export default {
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },

  getItem: (key) => {
    try {
      return window.localStorage.getItem(key)
    } catch (e) {
      return null
    }
  },

  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },

  clear: () => {
    try {
      window.localStorage.clear()
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },
  getCauseForGAM: () =>
    window.localStorage.getItem(STORAGE_NEW_USER_CAUSE_ID) || 'unknown',
}

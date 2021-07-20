/* global localStorage */

export default {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('localStorage not supported on server side', e)
    }
  },
  getItem: (key, value) => {
    try {
      localStorage.getItem(key, value)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('localStorage not supported on server side', e)
    }
  },
  removeItem: (key, value) => {
    try {
      localStorage.removeItem(key, value)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('localStorage not supported on server side', e)
    }
  },
}

/* global localStorage */

export default {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },
  getItem: (key, value) => {
    try {
      localStorage.getItem(key, value)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },
  removeItem: (key, value) => {
    try {
      localStorage.removeItem(key, value)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },
}

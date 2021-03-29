/* globals window */

/**
 * Change the window.location object, merging with existing values.
 * @param {Object} modifiedLocation - An object with any values
 *   to modify on the window.location object.
 * @return {undefined}
 */
const setWindowLocation = (modifiedLocation) => {
  const windowLocation = JSON.stringify(window.location)
  delete window.location
  Object.defineProperty(window, 'location', {
    value: { ...JSON.parse(windowLocation), ...modifiedLocation },
    configurable: true,
    writable: true,
  })
}

export default setWindowLocation

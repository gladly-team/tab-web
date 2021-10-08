/* eslint-env jest */

/**
 * Flush the Promise resolution queue. See:
 * https://github.com/facebook/jest/issues/2157
 * @return {Promise<undefined>}
 */
// See latest:
// https://github.com/facebook/jest/issues/2157#issuecomment-897935688
const flushAllPromises = async () =>
  new Promise(jest.requireActual('timers').setImmediate)

export default flushAllPromises

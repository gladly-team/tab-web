/**
 * Flush the Promise resolution queue. See:
 * https://github.com/facebook/jest/issues/2157
 * @return {Promise<undefined>}
 */
const flushAllPromises = async () => {
  await new Promise(resolve => setImmediate(resolve))
}

export default flushAllPromises

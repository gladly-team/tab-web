/**
 * Flush the Promise resolution queue. See:
 * https://github.com/facebook/jest/issues/2157
 * @return {Promise<undefined>}
 */
const flushAllPromises = async () => {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, 0)
  )
}

export default flushAllPromises

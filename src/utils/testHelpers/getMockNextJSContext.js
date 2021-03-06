// If we need more complex interactions with `ctx` or `req`/`res`,
// consider using this library:
// https://github.com/Xunnamius/next-test-api-route-handler

import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'

/**
 * Create a mock Next.js context (`ctx`) object.
 * @param {Boolean} serverSide - Whether the mock context should
 *   be server-side, including things like the res/req objects.
 * @return {Object}
 */
const getMockNextJSContext = ({ serverSide = true } = {}) => ({
  // Current route. That is the path of the page in /pages
  pathname: 'index',

  // Query string section of URL parsed as an object
  query: {},

  // String of the actual path (including the query) shown in the browser
  asPath: 'index',

  // HTTP request object (server only)
  ...(serverSide && { req: getMockReq() }),

  // HTTP response object (server only)
  ...(serverSide && { res: getMockRes() }),

  // Error object if any error is encountered during the rendering
  err: undefined,
})

export default getMockNextJSContext

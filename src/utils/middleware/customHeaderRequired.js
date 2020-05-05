import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import { CUSTOM_HEADER_NAME } from 'src/utils/middleware/constants'

// Requires a custom header be set. This serves as modest
// CSRF protection for API endpoints. See:
// https://github.com/gladly-team/tab-web#authentication-approach
export default (handler) => async (req, res) => {
  const customHeaderVal = get(req, [
    'headers',
    CUSTOM_HEADER_NAME.toLowerCase(),
  ])
  if (isNil(customHeaderVal)) {
    return res
      .status(400)
      .json({ error: `Invalid "${CUSTOM_HEADER_NAME}" header value.` })
  }
  return handler(req, res)
}

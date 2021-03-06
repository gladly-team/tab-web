import { flowRight } from 'lodash/util'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import onlyPostRequests from 'src/utils/middleware/onlyPostRequests'
import cookies from 'src/utils/middleware/cookies'
import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'

const optInCookieName = 'tabV4OptIn'

// Sets or unsets a cookie that determines whether CloudFront
// routes to this beta app or the exsting app.
const handler = (req, res) => {
  const optIn = get(req, 'body.optIn', null)
  if (isNil(optIn)) {
    return res.status(400).json({ error: 'Invalid "optIn" value.' })
  }
  const isOptedIn = !!optIn
  const cookieVal = isOptedIn ? 'enabled' : undefined
  req.cookie.set(optInCookieName, cookieVal, {
    maxAge: 157680000000, // 5 years
  })
  return res.status(200).json({ status: true })
}

// Endpoint does not require the user to be authenticated. See:
// https://github.com/gladly-team/tab-web#authentication-approach
export default flowRight([onlyPostRequests, cookies, customHeaderRequired])(
  handler
)

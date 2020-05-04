import cookies from 'src/utils/middleware/cookies'
import session from 'src/utils/middleware/session'
import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'

const optInCookieName = 'tabV4OptIn'

// Sets or unsets a cookie that determines whether CloudFront
// routes to this beta app or the exsting app.
const handler = (req, res) => {
  const isOptedIn = req.body.optIn === true
  const cookieVal = isOptedIn ? 'enabled' : undefined
  req.cookie.set(optInCookieName, cookieVal)
  res.status(200).json({ status: true })
}

// Endpoint does not require the user to be authenticated. See:
// https://github.com/gladly-team/tab-web#authentication-approach
export default cookies(session(customHeaderRequired(handler)))

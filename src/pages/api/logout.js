import cookies from 'src/utils/middleware/cookies'
import session from 'src/utils/middleware/session'
import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'

const handler = (req, res) => {
  // Destroy the session.
  // "If the value is omitted, an outbound header with an expired date is
  // used to delete the cookie."
  // https://github.com/pillarjs/cookies#cookiesset-name--value---options--
  req.session = null
  res.status(200).json({ status: true })
}

// Endpoint does not require the user to be authenticated. See:
// https://github.com/gladly-team/tab-web#authentication-approach
export default cookies(session(customHeaderRequired(handler)))

import commonAPIMiddleware from 'src/utils/middleware/APIMiddleware/commonAPIMiddleware'

const handler = (req, res) => {
  // Destroy the session.
  // "If the value is omitted, an outbound header with an expired date is
  // used to delete the cookie."
  // https://github.com/pillarjs/cookies#cookiesset-name--value---options--
  req.session = null
  res.status(200).json({ status: true })
}

export default commonAPIMiddleware(handler)

import commonMiddleware from 'src/utils/middleware/commonMiddleware'

const handler = (req, res) => {
  // Destroy the session.
  // "If the value is omitted, an outbound header with an expired date is
  // used to delete the cookie."
  // https://github.com/pillarjs/cookies#cookiesset-name--value---options--
  const mockSession = 'just an example'
  console.log('Setting session to: ', mockSession) // eslint-disable-line no-console
  req.session = mockSession // for debugging only
  // req.session = null
  res.status(200).json({ status: true })
}

export default commonMiddleware(handler)

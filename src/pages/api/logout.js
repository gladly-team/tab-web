import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'

const handler = (req, res) => {
  // TODO: use next-firebase-auth
  res.status(200).json({ status: true })
}

// Endpoint does not require the user to be authenticated. See:
// https://github.com/gladly-team/tab-web#authentication-approach
export default customHeaderRequired(handler)

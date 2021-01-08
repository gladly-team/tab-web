import commonAPIMiddleware from 'src/utils/middleware/commonAPIMiddleware'

const handler = (req, res) =>
  // FIXME: use next-firebase-auth
  res.status(200).json({ success: true })

export default commonAPIMiddleware(handler)

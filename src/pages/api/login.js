import commonAPIMiddleware from 'src/utils/middleware/APIMiddleware/commonAPIMiddleware'
import { verifyIdToken } from 'src/utils/auth/firebaseAdmin'

const handler = (req, res) => {
  console.log(req.tab)
  if (!req.body) {
    return res.status(400)
  }

  const { token } = req.body

  return verifyIdToken(token)
    .then(decodedToken => {
      req.session = {
        ...(req.session || {}),
        decodedToken,
        token,
      }
      return decodedToken
    })
    .then(() => {
      return res.status(200).json({ status: true })
    })
    .catch(error => {
      // TODO: log error
      console.error(error) // eslint-disable-line no-console
      return res.status(500).json({ error })
    })
}

export default commonAPIMiddleware(handler)

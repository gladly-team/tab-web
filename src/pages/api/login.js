import commonMiddleware from 'src/utils/middleware/commonMiddleware'
import { verifyIdToken } from 'src/utils/auth/firebaseAdmin'

const handler = (req, res) => {
  if (!req.body) {
    return res.status(400)
  }

  const { token } = req.body

  return verifyIdToken(token)
    .then(decodedToken => {
      req.session = {
        decodedToken,
        token,
      }
      return decodedToken
    })
    .then(decodedToken => {
      return res.status(200).json({ status: true, decodedToken })
    })
    .catch(error => {
      return res.status(500).json({ error })
    })
}

export default commonMiddleware(handler)

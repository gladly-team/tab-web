import cookies from 'src/utils/middleware/cookies'
import session from 'src/utils/middleware/session'
import addUserFromAuthorizationToken from 'src/utils/middleware/APIMiddleware/addUserFromAuthorizationToken'
import authProtected from 'src/utils/middleware/APIMiddleware/authProtected'
import customHeaderRequired from 'src/utils/middleware/APIMiddleware/customHeaderRequired'

// Load environment variables.
require('src/env')

export default handler =>
  customHeaderRequired(
    cookies(session(addUserFromAuthorizationToken(authProtected(handler))))
  )

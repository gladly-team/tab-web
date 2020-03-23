import cookies from 'src/utils/middleware/cookies'
import session from 'src/utils/middleware/session'
import addUserFromAuthorizationToken from 'src/utils/middleware/addUserFromAuthorizationToken'
import authProtected from 'src/utils/middleware/authProtected'
import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'

// Load environment variables.
require('src/env')

export default handler =>
  customHeaderRequired(
    cookies(session(addUserFromAuthorizationToken(authProtected(handler))))
  )

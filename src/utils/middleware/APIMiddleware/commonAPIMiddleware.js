import cookies from 'src/utils/middleware/cookies'
import session from 'src/utils/middleware/session'
import addUserFromAuthorizationToken from 'src/utils/middleware/APIMiddleware/addUserFromAuthorizationToken'

// Load environment variables.
require('src/env')

export default handler =>
  cookies(session(addUserFromAuthorizationToken(handler)))

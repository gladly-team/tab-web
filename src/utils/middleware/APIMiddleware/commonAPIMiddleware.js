import cookies from 'src/utils/middleware/cookies'
import addUserFromAuthorizationToken from 'src/utils/middleware/APIMiddleware/addUserFromAuthorizationToken'

// Load environment variables.
require('src/env')

export default handler => addUserFromAuthorizationToken(cookies(handler))

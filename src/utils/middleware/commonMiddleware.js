import cookieSession from 'src/utils/middleware/cookieSession'
import cookieSessionRefresh from 'src/utils/middleware/cookieSessionRefresh'

// Load environment variables.
require('src/env')

export default handler => cookieSession(cookieSessionRefresh(handler))

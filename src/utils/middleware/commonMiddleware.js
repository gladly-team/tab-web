import cookieSession from './cookieSession'
import cookieSessionRefresh from './cookieSessionRefresh'

// Load environment variables.
require('src/env')

export default handler => cookieSession(cookieSessionRefresh(handler))

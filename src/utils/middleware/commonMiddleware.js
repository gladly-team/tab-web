import cookies from 'src/utils/middleware/cookies'
// import session from 'src/utils/middleware/session'
// import sessionRefresh from 'src/utils/middleware/sessionRefresh'

// Load environment variables.
require('src/env')

// export default handler => cookies(session(sessionRefresh(handler)))
export default handler => cookies(handler)

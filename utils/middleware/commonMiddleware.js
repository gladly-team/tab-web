const cookieSession = require('./cookieSession')
const cookieSessionRefresh = require('./cookieSessionRefresh')

// Load environment variables.
require('../../env')

module.exports = handler => cookieSession(cookieSessionRefresh(handler))

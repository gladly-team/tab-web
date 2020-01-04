const bodyParser = require('body-parser')
const cookieSession = require('./cookieSession')
const cookieSessionRefresh = require('./cookieSessionRefresh')

module.exports = [bodyParser.json(), cookieSession, cookieSessionRefresh]

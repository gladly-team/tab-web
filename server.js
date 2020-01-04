/* eslint no-console: 0 */

// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-firebase-authentication/server.js

// Load environment variables.
require('./env')

const express = require('express')
const bodyParser = require('body-parser')
const nextJs = require('next')

const { verifyIdToken } = require('./utils/auth/firebaseAdmin')
const cookieSession = require('./utils/middleware/cookieSession')
const cookieSessionRefresh = require('./utils/middleware/cookieSessionRefresh')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = nextJs({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())
  server.use(cookieSession)

  // Update a value in the cookie so that the set-cookie will be sent.
  // Only changes every minute so that it's not sent with every request.
  server.use(cookieSessionRefresh)

  // FIXME: these API endpoints aren't working on Now. Probably need
  //   to define the custom server.js for deployment.
  //   Or, we may want to use the serverless structure:
  //   https://nextjs.org/docs/api-routes/introduction
  server.post('/api/login', (req, res) => {
    if (!req.body) {
      return res.sendStatus(400)
    }

    const { token } = req.body

    return verifyIdToken(token)
      .then(decodedToken => {
        req.session.decodedToken = decodedToken
        req.session.token = token
        return decodedToken
      })
      .then(decodedToken => res.json({ status: true, decodedToken }))
      .catch(error => res.json({ error }))
  })

  server.post('/api/logout', (req, res) => {
    req.session.decodedToken = null
    req.session.token = null
    res.json({ status: true })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }

    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`)
  })
})

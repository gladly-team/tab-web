/* eslint no-console: 0 */

// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-firebase-authentication/server.js

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const next = require('next')
const admin = require('firebase-admin')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY

const firebase = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // https://stackoverflow.com/a/41044630/1332513
    privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
})

// Ensure that session secrets are set.
if (
  !(process.env.SESSION_SECRET_CURRENT && process.env.SESSION_SECRET_PREVIOUS)
) {
  throw new Error(
    'Session secrets must be set as env vars `SESSION_SECRET_CURRENT` and `SESSION_SECRET_PREVIOUS`.'
  )
}

// An array is useful for rotating secrets without invalidating old sessions.
// "If an array of secrets is provided, only the first element will
//  be used to sign the session ID cookie, while all the elements will
//  be considered when verifying the signature in requests."
// https://github.com/expressjs/session#secret
const sessionSecrets = [
  process.env.SESSION_SECRET_CURRENT,
  process.env.SESSION_SECRET_PREVIOUS,
]

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())
  server.use(
    session({
      secret: sessionSecrets,
      saveUninitialized: true,
      // TODO: use another store, like DynamoDB
      store: new FileStore({ secret: sessionSecrets[0] }),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: {
        // TODO: set other options, such as "secure", "sameSite", etc.
        // https://github.com/expressjs/session#cookie
        maxAge: 604800000, // week
      },
    })
  )

  server.post('/api/login', (req, res) => {
    if (!req.body) {
      return res.sendStatus(400)
    }

    const { token } = req.body

    return firebase
      .auth()
      .verifyIdToken(token)
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

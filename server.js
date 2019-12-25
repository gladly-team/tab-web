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

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())
  server.use(
    session({
      secret: 'geheimnis', // FIXME: real secret
      saveUninitialized: true,
      store: new FileStore({ secret: 'geheimnis' }), // FIXME: real secret
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 }, // week
    })
  )

  // server.use((req, res, next) => {
  //   req.firebaseServer = firebase
  //   next()
  // })

  server.post('/api/login', (req, res) => {
    if (!req.body) {
      return res.sendStatus(400)
    }

    const { token } = req.body

    firebase
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        // TODO
        console.log('decoded token', decodedToken)
        // req.session.decodedToken = decodedToken
        return decodedToken
      })
      .then(decodedToken => res.json({ status: true, decodedToken }))
      .catch(error => res.json({ error }))
  })

  server.post('/api/logout', (req, res) => {
    req.session.decodedToken = null
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

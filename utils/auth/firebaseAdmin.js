/* eslint import/prefer-default-export: 0 */
const admin = require('firebase-admin')

let firebase
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY

if (!firebase) {
  firebase = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // https://stackoverflow.com/a/41044630/1332513
      privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  })
}

const verifyIdToken = token => {
  return firebase
    .auth()
    .verifyIdToken(token)
    .catch(error => {
      throw error
    })
}

module.exports = {
  verifyIdToken,
}

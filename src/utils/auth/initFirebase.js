import firebase from 'firebase/app'
import 'firebase/auth'
import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'

try {
  ensureValuesAreDefined([
    process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  ])
} catch (e) {
  throw new Error(
    'One or more of the Firebase environment variables is not set.'
  )
}

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

export default () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}

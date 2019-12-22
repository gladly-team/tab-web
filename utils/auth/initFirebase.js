import firebase from 'firebase/app'
import 'firebase/auth'

const config = {
  // TODO: env vars
  apiKey: 'AIzaSyDrGghKLnfOwwaSnPM0unRDXz_4YdorKU4',
  authDomain: 'dev-tab-for-a-cause.firebaseapp.com',
  databaseURL: 'https://dev-tab-for-a-cause.firebaseio.com',
  projectId: 'dev-tab-for-a-cause',
}

export default () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
}

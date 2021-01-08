const firebaseApp = jest.createMockFromModule('firebase')

const authMock = {
  get currentUser() {
    return null
  },
  // Takes a callback.
  onAuthStateChanged: jest.fn(),
  signInAnonymously: jest.fn(() =>
    // Should resolve into a non-null Firebase user credential.
    // https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#signInAnonymously
    // `firebaseUser` should be non-null, so we should call
    // `__setFirebaseUser` beforehand.
    Promise.resolve({
      credential: {},
      user: null,
      additionalUserInfo: {},
    })
  ),
  signOut: jest.fn(() => Promise.resolve()),
  signInAndRetrieveDataWithCredential: jest.fn(() =>
    // Should resolve into a non-null Firebase user credential.
    Promise.resolve({
      credential: {},
      user: null,
      additionalUserInfo: {},
    })
  ),
}

const FirebaseAuthMock = jest.fn(() => authMock)
FirebaseAuthMock.EmailAuthProvider = {
  PROVIDER_ID: 'password',
}
FirebaseAuthMock.GoogleAuthProvider = {
  PROVIDER_ID: 'google.com',
}
FirebaseAuthMock.FacebookAuthProvider = {
  PROVIDER_ID: 'facebook.com',
}
firebaseApp.auth = FirebaseAuthMock

module.exports = firebaseApp

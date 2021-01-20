/* eslint-env jest */

// https://github.com/gladly-team/next-firebase-auth#authuser
const getMockAuthUser = () => ({
  id: 'mock-user-id',
  email: 'mockUser@example.com',
  emailVerified: true,
  getIdToken: jest.fn(async () => 'mock-id-token'),
  clientInitialized: true,
  firebaseUser: {},
  signOut: jest.fn(),
  serialize: jest.fn(() => ({})),
})

export default getMockAuthUser

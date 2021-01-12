// https://github.com/gladly-team/next-firebase-auth#authuser
const createMockAuthUser = () => ({
  id: 'mock-user-id',
  email: 'mockUser@example.com',
  emailVerified: true,
  getIdToken: jest.fn(async () => 'mock-id-token'),
  clientInitialized: true,
  firebaseUser: {},
  signOut: jest.fn(),
  serialize: jest.fn(() => ({})),
})

const verifyIdToken = jest.fn(async (token) => {
  if (!token) {
    throw new Error('verifyIdToken requires a token')
  }
  return createMockAuthUser()
})

export default verifyIdToken

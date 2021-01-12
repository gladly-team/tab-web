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

const useAuthUser = jest.fn(() => createMockAuthUser())

export default useAuthUser

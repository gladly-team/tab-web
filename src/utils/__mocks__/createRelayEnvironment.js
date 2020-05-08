/* eslint-env jest */

export default jest.fn(({ token }) => ({
  // This is not the shape of the Relay environment object.
  // It's just for testing.
  isMockRelayEnvironment: true,
  mockUserToken: token,
}))

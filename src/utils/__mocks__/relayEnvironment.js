export const initRelayEnvironment = jest.fn(({ token }) => ({
  isMockRelayEnvironment: true, // just for testing
  mockUserToken: token, // just for testing
  getStore: jest.fn(() => ({
    getSource: jest.fn(() => ({
      toJSON: jest.fn(),
    })),
  })),
}))

// TODO
export const useRelayEnvironment = jest.fn()

const createMockRelayEnvironment = (token = null) => ({
  isMockRelayEnvironment: true, // just for testing
  mockUserToken: token, // just for testing
  getStore: jest.fn(() => ({
    getSource: jest.fn(() => ({
      toJSON: jest.fn(),
    })),
  })),
})

export const initRelayEnvironment = jest.fn(({ token }) =>
  createMockRelayEnvironment(token)
)

export const getRelayEnvironment = jest.fn(() => createMockRelayEnvironment())

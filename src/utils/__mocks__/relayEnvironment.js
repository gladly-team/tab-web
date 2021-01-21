import { isServerSide } from 'src/utils/ssr'

const createMockNetwork = (getIdToken) => ({
  _mockId:
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9),
  _mockGetIdToken: getIdToken,
})

const createMockStore = (initialRecords) => ({
  _mockId:
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9),
  getSource: jest.fn(() => ({
    toJSON: jest.fn(),
  })),
  publish: jest.fn(),
  _mockInitialRecords: initialRecords,
})

const createMockEnvironment = ({ network, store }) => ({
  _isMockRelayEnvironment: true, // just for testing
  // Mock ID to test reuse/recreation of the Relay environment.
  _mockId:
    Math.random().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 9),
  network,
  store,
  getNetwork: jest.fn(() => network),
  getStore: jest.fn(() => store),
})

let mockRelayEnv
const createMockInitRelayEnv = () => {
  let mockRelayNetwork
  let mockRelayStore
  return ({
    initialRecords,
    getIdToken = async () => null,
    recreateNetwork = false,
    recreateStore = false,
  } = {}) => {
    const shouldReuseEnv =
      !isServerSide() && mockRelayEnv && !recreateNetwork && !recreateStore
    if (shouldReuseEnv) {
      return mockRelayEnv
    }
    mockRelayNetwork =
      mockRelayNetwork && !recreateNetwork
        ? mockRelayNetwork
        : createMockNetwork(getIdToken)
    mockRelayStore =
      mockRelayStore && !recreateStore
        ? mockRelayStore
        : createMockStore(initialRecords)
    mockRelayEnv = createMockEnvironment({
      network: mockRelayNetwork,
      store: mockRelayStore,
    })
    return mockRelayEnv
  }
}

export const initRelayEnvironment = jest.fn(createMockInitRelayEnv())

export const getRelayEnvironment = jest.fn(() => mockRelayEnv)

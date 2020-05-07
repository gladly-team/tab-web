jest.mock('relay-runtime')
jest.mock('isomorphic-unfetch')
jest.mock('src/utils/ssr')

beforeEach(() => {
  const { Environment, Network, Store } = require('relay-runtime')
  Network.create.mockImplementation(() => ({
    isMockRelayNetwork: true,
  }))
  Store.mockImplementation(() => ({
    isMockRelayStore: true,
  }))
  Environment.mockImplementation(({ network, store }) => ({
    isMockRelayEnvironment: true,
    _network: network,
    _store: store,
  }))
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('createRelayEnvironment', () => {
  it('returns a Relay environment', () => {
    expect.assertions(1)
    const initEnvironment = require('src/utils/createRelayEnvironment').default
    const response = initEnvironment()
    expect(response).toEqual({
      isMockRelayEnvironment: true,
      _network: { isMockRelayNetwork: true },
      _store: { isMockRelayStore: true },
    })
  })

  it('calls Network.create', () => {
    expect.assertions(1)
    const initEnvironment = require('src/utils/createRelayEnvironment').default
    initEnvironment()
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledWith(expect.any(Function))
  })
})

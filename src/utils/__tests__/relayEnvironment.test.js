import getMockFetchResponse from 'src/utils/testHelpers/getMockFetchResponse'

jest.mock('relay-runtime')
jest.mock('src/utils/ssr')

beforeEach(() => {
  const { isServerSide } = require('src/utils/ssr')
  isServerSide.mockReturnValue(true)

  const { Environment, Network, RecordSource, Store } = require('relay-runtime')
  Network.create.mockImplementation(() => ({
    isMockRelayNetwork: true,
  }))
  Store.mockImplementation(() => ({
    isMockRelayStore: true,
    publish: jest.fn(),
  }))
  RecordSource.mockImplementation((records) => ({
    ...records,
    isMockRecordSource: true,
  }))

  function MockEnvironment({ network, store }) {
    // The ID is to test environment re-creation / reusing
    this.mockId =
      Math.random().toString(36).substr(2, 9) +
      Math.random().toString(36).substr(2, 9)
    this.isMockRelayEnvironment = true
    this._network = network // eslint-disable-line no-underscore-dangle
    this._store = store // eslint-disable-line no-underscore-dangle
    this.getNetwork = () => network
    this.getStore = () => store
  }
  Environment.mockImplementation((args) => new MockEnvironment(args))

  process.env.NEXT_PUBLIC_RELAY_ENDPOINT = '/mock-relay-endpoint/here/'
  fetch.mockResolvedValue(getMockFetchResponse())
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('initRelayEnvironment', () => {
  it('returns a Relay environment', () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const response = initRelayEnvironment()
    expect(response).toMatchObject({
      isMockRelayEnvironment: true,
      mockId: expect.any(String),
      _network: { isMockRelayNetwork: true },
      _store: { isMockRelayStore: true },
    })
  })

  it('returns a new Relay environment when called a second time on the server', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(true)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const mockGetIdToken = async () => 'some-fake-token'
    const mockInitialRecords = { some: 'records' }
    const firstEnv = initRelayEnvironment({
      initialRecords: mockInitialRecords,
      getIdToken: mockGetIdToken,
    })
    const secondEnv = initRelayEnvironment({
      initialRecords: mockInitialRecords,
      getIdToken: mockGetIdToken,
    })
    expect(firstEnv).not.toEqual(secondEnv)
  })

  it('returns the same Relay environment when called a second time on the client-side without a token function', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const firstEnv = initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const secondEnv = initRelayEnvironment({
      initialRecords: { some: 'stuff' },
    })
    expect(firstEnv).toEqual(secondEnv)
  })

  it('returns the same Relay environment when called a second time on the client-side with a token function', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const firstEnv = initRelayEnvironment({
      getIdToken: async () => 'some-fake-token',
    })
    const secondEnv = initRelayEnvironment({
      getIdToken: async () => 'some-fake-token',
    })
    expect(firstEnv).toEqual(secondEnv)
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('publishes initialRecords when reusing the environment on the client side', () => {
    expect.assertions(2)
    const { RecordSource } = require('relay-runtime')
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const firstEnv = initRelayEnvironment({
      getIdToken: async () => 'some-fake-token',
      initialRecords: { some: 'stuff' },
    })
    expect(firstEnv.getStore().publish).toHaveBeenCalledWith(
      new RecordSource({ some: 'stuff' })
    )
    const secondEnv = initRelayEnvironment({
      getIdToken: async () => 'some-fake-token',
      initialRecords: { other: 'things' },
    })
    expect(secondEnv.getStore().publish).toHaveBeenCalledWith(
      new RecordSource({ other: 'things' })
    )
  })

  it('returns a new Relay environment when called a second time on the client-side with "recreateNetwork" and "recreateStore" set to true', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const firstEnv = initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const secondEnv = initRelayEnvironment({
      initialRecords: { some: 'stuff' },
      recreateNetwork: true,
      recreateStore: true,
    })
    expect(firstEnv).not.toEqual(secondEnv)
  })

  it('calls Network.create with a function', () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledWith(expect.any(Function))
  })

  it('calls Network.create a second time when we call initRelayEnvironment twice on the server', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(true)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledTimes(2)
  })

  it('calls Network.create only once on the client-side, even when we call initRelayEnvironment twice', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledTimes(1)
  })

  it('calls Network.create twice on the client-side when "recreateNetwork" is true', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    initRelayEnvironment({ recreateNetwork: true })
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledTimes(2)
  })

  it('instantiates Store a second time when we call initRelayEnvironment twice on the server', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(true)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const { Store } = require('relay-runtime')
    expect(Store).toHaveBeenCalledTimes(2)
  })

  it('instantiates the Store only once on the client-side, even when we call initRelayEnvironment twice', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const { Store } = require('relay-runtime')
    expect(Store).toHaveBeenCalledTimes(1)
  })

  it('instantiates the Store twice on the client-side when "recreateStore" is true', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    initRelayEnvironment({
      initialRecords: { some: 'stuff' },
      recreateStore: true,
    })
    const { Store } = require('relay-runtime')
    expect(Store).toHaveBeenCalledTimes(2)
  })

  it('provides the expected `fetch` function to Network.create when when the Relay environment was created with a getIdToken function', async () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    fetch.mockResolvedValue(getMockFetchResponse())
    initRelayEnvironment({ getIdToken: async () => 'some-fake-token' })
    const { Network } = require('relay-runtime')
    const fetchFunc = Network.create.mock.calls[0][0]
    await fetchFunc('someFakeQuery', { myVar: 'here' })
    expect(fetch).toHaveBeenCalledWith('/mock-relay-endpoint/here/', {
      body: '{"variables":{"myVar":"here"}}',
      headers: {
        Accept: 'application/json',
        Authorization: 'some-fake-token',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  })

  it('provides the expected `fetch` function to Network.create when the Relay environment was created without a getIdToken function', async () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    fetch.mockResolvedValue(getMockFetchResponse())
    initRelayEnvironment({ initialRecords: { some: 'stuff' } }) //  no token provided
    const { Network } = require('relay-runtime')
    const fetchFunc = Network.create.mock.calls[0][0]
    await fetchFunc('someFakeQuery', { lookAt: 'this', thing: 123 })
    expect(fetch).toHaveBeenCalledWith('/mock-relay-endpoint/here/', {
      body: '{"variables":{"lookAt":"this","thing":123}}',
      headers: {
        Accept: 'application/json',
        Authorization: 'unauthenticated',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
  })

  it('returns the response JSON when calling the `fetch` function provided to Network.create', async () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    fetch.mockResolvedValue({
      ...getMockFetchResponse(),
      json: () => Promise.resolve({ my: 'data' }),
    })
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    const { Network } = require('relay-runtime')
    const fetchFunc = Network.create.mock.calls[0][0]
    const response = await fetchFunc('someFakeQuery', { myVar: 'here' })
    expect(response).toEqual({
      my: 'data',
    })
  })
})

describe('getRelayEnvironment', () => {
  it('throws if the environment has not already been created', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { getRelayEnvironment } = require('src/utils/relayEnvironment')
    expect(() => {
      getRelayEnvironment()
    }).toThrow(
      'The Relay environment was expected to have been already created but was not.'
    )
  })

  it('does not throw if the environment has already been created', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const {
      initRelayEnvironment,
      getRelayEnvironment,
    } = require('src/utils/relayEnvironment')
    initRelayEnvironment({ initialRecords: { some: 'stuff' } })
    getRelayEnvironment()
    expect(() => {
      getRelayEnvironment()
    }).not.toThrow()
  })

  it('returns the existing environment', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const {
      initRelayEnvironment,
      getRelayEnvironment,
    } = require('src/utils/relayEnvironment')
    const expectedEnv = initRelayEnvironment({
      initialRecords: { some: 'stuff' },
    })
    const response = getRelayEnvironment()
    expect(response).toEqual(expectedEnv)
  })
})

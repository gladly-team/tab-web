import getMockFetchResponse from 'src/utils/testHelpers/getMockFetchResponse'

jest.mock('relay-runtime')
jest.mock('src/utils/ssr')

beforeEach(() => {
  const { isServerSide } = require('src/utils/ssr')
  isServerSide.mockReturnValue(true)

  const { Environment, Network, Store } = require('relay-runtime')
  Network.create.mockImplementation(() => ({
    isMockRelayNetwork: true,
  }))
  Store.mockImplementation(() => ({
    isMockRelayStore: true,
  }))

  function MockEnvironment({ network, store }) {
    // The ID is to test environment re-creation / reusing
    this.mockId = Math.random().toString(36).substr(2, 9)
    this.isMockRelayEnvironment = true
    this._network = network // eslint-disable-line no-underscore-dangle
    this._store = store // eslint-disable-line no-underscore-dangle
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
    const firstEnv = initRelayEnvironment()
    const secondEnv = initRelayEnvironment()
    expect(firstEnv).not.toEqual(secondEnv)
  })

  it('returns the same Relay environment when called a second time on the client-side with the same (empty) token', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const firstEnv = initRelayEnvironment()
    const secondEnv = initRelayEnvironment()
    expect(firstEnv).toEqual(secondEnv)
  })

  it('returns the same Relay environment when called a second time on the client-side with the same non-empty token', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    const firstEnv = initRelayEnvironment({ token: 'abc-123' })
    const secondEnv = initRelayEnvironment({ token: 'abc-123' })
    expect(firstEnv).toEqual(secondEnv)
  })

  it('calls Network.create with a function', () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment()
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledWith(expect.any(Function))
  })

  it('calls Network.create a second time when we call initRelayEnvironment twice on the server', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(true)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment()
    initRelayEnvironment()
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledTimes(2)
  })

  it('calls Network.create only once on the client-side, even when we call initRelayEnvironment twice', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment()
    initRelayEnvironment()
    const { Network } = require('relay-runtime')
    expect(Network.create).toHaveBeenCalledTimes(1)
  })

  it('instantiates Store a second time when we call initRelayEnvironment twice on the server', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(true)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment()
    initRelayEnvironment()
    const { Store } = require('relay-runtime')
    expect(Store).toHaveBeenCalledTimes(2)
  })

  it('instantiates Store only once on the client-side, even when we call initRelayEnvironment twice', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment()
    initRelayEnvironment()
    const { Store } = require('relay-runtime')
    expect(Store).toHaveBeenCalledTimes(1)
  })

  it('throws if the "throwIfNotPreviouslyCreated" option is true and the environment has not already been created', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    expect(() => {
      initRelayEnvironment({ throwIfNotPreviouslyCreated: true })
    }).toThrow(
      'The Relay environment was expected to have been already created but was not.'
    )
  })

  it('does not throw if the "throwIfNotPreviouslyCreated" option is true but the environment has already been created', () => {
    expect.assertions(1)
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(false)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    initRelayEnvironment()
    expect(() => {
      initRelayEnvironment({ throwIfNotPreviouslyCreated: true })
    }).not.toThrow()
  })

  it('provides the expected `fetch` function to Network.create when when the Relay environment was created with a user token', async () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    fetch.mockResolvedValue(getMockFetchResponse())
    initRelayEnvironment({ token: 'some-fake-token' })
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

  it('provides the expected `fetch` function to Network.create when the Relay environment was created without a user token', async () => {
    expect.assertions(1)
    const { initRelayEnvironment } = require('src/utils/relayEnvironment')
    fetch.mockResolvedValue(getMockFetchResponse())
    initRelayEnvironment() //  no token provided
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
    initRelayEnvironment()
    const { Network } = require('relay-runtime')
    const fetchFunc = Network.create.mock.calls[0][0]
    const response = await fetchFunc('someFakeQuery', { myVar: 'here' })
    expect(response).toEqual({
      my: 'data',
    })
  })
})

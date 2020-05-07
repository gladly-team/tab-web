import getMockFetchResponse from 'src/utils/testHelpers/getMockFetchResponse'

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

  process.env.RELAY_ENDPOINT = '/mock-relay-endpoint/here/'

  const fetch = require('isomorphic-unfetch').default
  fetch.mockResolvedValue(getMockFetchResponse())
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

  it('provides the expected `fetch` function to Network.create when called with a user token', async () => {
    expect.assertions(1)
    const initEnvironment = require('src/utils/createRelayEnvironment').default
    const fetch = require('isomorphic-unfetch').default
    fetch.mockResolvedValue(getMockFetchResponse())
    initEnvironment()
    const { Network } = require('relay-runtime')
    const fetchFunc = Network.create.mock.calls[0][0]
    await fetchFunc(
      'someFakeQuery',
      { myVar: 'here' },
      { token: 'some-fake-token' }
    )
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

  it('provides the expected `fetch` function to Network.create when called without a user token', async () => {
    expect.assertions(1)
    const initEnvironment = require('src/utils/createRelayEnvironment').default
    const fetch = require('isomorphic-unfetch').default
    fetch.mockResolvedValue(getMockFetchResponse())
    initEnvironment()
    const { Network } = require('relay-runtime')
    const fetchFunc = Network.create.mock.calls[0][0]
    await fetchFunc(
      'someFakeQuery',
      { lookAt: 'this', thing: 123 }
      // { token: 'some-fake-token' } // not provided
    )
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
})

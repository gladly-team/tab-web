import { Network } from 'relay-runtime'
// import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import initEnvironment from 'src/utils/createRelayEnvironment'

jest.mock('relay-runtime')
jest.mock('isomorphic-unfetch')
jest.mock('src/utils/ssr')

afterEach(() => {
  jest.clearAllMocks()
})

describe('createRelayEnvironment', () => {
  it('calls Network.create', () => {
    expect.assertions(1)
    initEnvironment()
    expect(Network.create).toHaveBeenCalled()
  })
})

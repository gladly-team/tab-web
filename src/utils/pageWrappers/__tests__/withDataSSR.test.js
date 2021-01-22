import { fetchQuery } from 'react-relay'
import { initRelayEnvironment } from 'src/utils/relayEnvironment'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

jest.mock('react-relay')
jest.mock('src/utils/relayEnvironment')

beforeEach(() => {
  fetchQuery.mockResolvedValue({ my: 'data!' })
})

afterEach(() => {
  jest.clearAllMocks()
})

const getMockCtxWithAuthUser = () => ({
  ...getMockNextJSContext(),
  AuthUser: getMockAuthUser(),
})

const setMockRelayRecords = (relayEnvironment, initialRecords) => {
  // Mutate the environment as a quick mock.
  // eslint-disable-next-line no-param-reassign
  relayEnvironment.getStore = jest.fn(() => ({
    getSource: jest.fn(() => ({
      toJSON: jest.fn(() => initialRecords),
    })),
  }))
}

describe('withRelay', () => {
  it('returns the expected props', async () => {
    expect.assertions(1)

    // Mock the Relay environment's records.
    const env = initRelayEnvironment()
    setMockRelayRecords(env, {
      fake: ['initial', 'data', 'here'],
    })

    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    const ctx = getMockCtxWithAuthUser()
    const mockGetRelayFunc = async () => ({
      query: { some: 'query' },
      variables: { some: 'variables' },
    })
    const response = await withDataSSR(mockGetRelayFunc)()(ctx)
    expect(response).toEqual({
      data: {
        my: 'data!',
      },
      initialRecords: {
        fake: ['initial', 'data', 'here'],
      },
    })
  })
})

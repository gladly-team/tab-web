import { fetchQuery } from 'react-relay'
import { initRelayEnvironment } from 'src/utils/relayEnvironment'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

jest.mock('react-relay')
jest.mock('src/utils/relayEnvironment')

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
const mockRelayQuery = { some: 'query' }
const mockGetRelayVariables = jest.fn()
beforeEach(() => {
  fetchQuery.mockResolvedValue({ my: 'data!' })
})

afterEach(() => {
  jest.clearAllMocks()
})
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
    const response = await withDataSSR(mockRelayQuery, mockGetRelayVariables)()(
      ctx
    )
    expect(response).toEqual({
      data: {
        my: 'data!',
      },
      initialRecords: {
        fake: ['initial', 'data', 'here'],
      },
    })
  })

  it('calls the getRelayQuery function with the AuthUser', async () => {
    expect.assertions(1)
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    const ctx = getMockCtxWithAuthUser()
    await withDataSSR(mockRelayQuery, mockGetRelayVariables)()(ctx)
    expect(mockGetRelayVariables).toHaveBeenCalledWith({
      AuthUser: ctx.AuthUser,
    })
  })

  it('inits the Relay environment with the AuthUser.getIdToken function', async () => {
    expect.assertions(1)
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    const ctx = getMockCtxWithAuthUser()
    await withDataSSR(mockRelayQuery, mockGetRelayVariables)()(ctx)
    expect(initRelayEnvironment).toHaveBeenCalledWith({
      getIdToken: ctx.AuthUser.getIdToken,
    })
  })

  it('removes undefined values from data, which Next.js cannot serialize', async () => {
    // Deals with this:
    // https://github.com/vercel/next.js/discussions/11209#discussioncomment-35915
    expect.assertions(1)
    fetchQuery.mockResolvedValue({
      my: 'data!',
      something: undefined,
      another: { thing: 'here', stuff: undefined },
    })
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    const ctx = getMockCtxWithAuthUser()
    const response = await withDataSSR(mockRelayQuery, mockGetRelayVariables)()(
      ctx
    )
    expect(response).toMatchObject({
      data: { my: 'data!', another: { thing: 'here' } },
    })
  })

  it('if the returned data is an empty object, it returns null for the data value', async () => {
    expect.assertions(1)
    fetchQuery.mockResolvedValue({})
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    const ctx = getMockCtxWithAuthUser()
    const response = await withDataSSR(mockRelayQuery, mockGetRelayVariables)()(
      ctx
    )
    expect(response).toMatchObject({
      data: null,
    })
  })

  it('includes composed props', async () => {
    expect.assertions(1)
    const getSSPFunc = async () => ({
      other: 'stuff',
    })
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    const ctx = getMockCtxWithAuthUser()
    const response = await withDataSSR(
      mockRelayQuery,
      mockGetRelayVariables
    )(getSSPFunc)(ctx)
    expect(response).toMatchObject({
      other: 'stuff',
      data: {
        my: 'data!',
      },
    })
  })
})

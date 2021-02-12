// Tests for module loading, which require resetting modules
// between tests.

import React from 'react'
import { shallow } from 'enzyme'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

jest.mock('tab-ads')
jest.mock('next-firebase-auth')
jest.mock('@material-ui/icons/Settings')
jest.mock('src/components/Link')
jest.mock('src/utils/navigation')
jest.mock('src/utils/adHelpers')
jest.mock('src/utils/ssr')
jest.mock('src/components/Logo')
jest.mock('src/components/MoneyRaisedContainer')
jest.mock('src/components/SearchInput')
jest.mock('src/utils/featureFlags')
jest.mock('src/components/Achievement', () => () => (
  <div data-test-id="mock-achievement" />
))
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/hooks/useData')
jest.mock('src/components/FullPageLoader')
jest.mock('src/utils/pageWrappers/withDataSSR')

const getMockProps = () => ({
  data: {
    app: {},
    user: {
      tabs: 221,
      vcCurrent: 78,
    },
  },
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('index.js: HOC', () => {
  it('calls `withAuthUser` and shows a loader then redirects if the user is unauthed', async () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const { withAuthUser, AuthAction } = require('next-firebase-auth')
    const FullPageLoader = require('src/components/FullPageLoader').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    expect(withAuthUser).toHaveBeenCalledWith({
      whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
      LoaderComponent: FullPageLoader,
      whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    })
  })

  it('calls `withRelay`', async () => {
    expect.assertions(1)
    const IndexPage = require('src/pages/index').default
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    expect(withRelay).toHaveBeenCalled()
  })
})

describe('index.js: getServerSideProps', () => {
  it('calls `withAuthUserTokenSSR` shows a loader when unauthed', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const { withAuthUserTokenSSR, AuthAction } = require('next-firebase-auth')
    const FullPageLoader = require('src/components/FullPageLoader').default
    await getServerSideProps()
    expect(withAuthUserTokenSSR).toHaveBeenCalledWith({
      whenUnauthed: AuthAction.SHOW_LOADER,
      LoaderComponent: FullPageLoader,
    })
  })

  it('calls `withDataSSR` with a query object and variable function', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    await getServerSideProps()
    expect(withDataSSR).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    )
  })

  it('returns query info from  the "RelayQuery" variable and "getRelayQueryVariables" passed to `withDataSSR` when we call it with an AuthUser', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    getServerSideProps()
    const relayQuery = withDataSSR.mock.calls[0][0]
    const getRelayQueryVariablesFunc = withDataSSR.mock.calls[0][1]
    const variables = await getRelayQueryVariablesFunc({
      AuthUser: getMockAuthUser(),
    })
    expect({ query: relayQuery, variables }).toEqual({
      query: expect.any(Object),
      variables: {
        userId: 'mock-user-id',
      },
    })
  })

  it('returns an empty object from the "getRelayQueryVariables" passed to `withDataSSR` when we call it with an *unauthed* AuthUser', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    getServerSideProps()
    const getRelayQueryVariablesFunc = withDataSSR.mock.calls[0][1]
    const response = await getRelayQueryVariablesFunc({
      AuthUser: { ...getMockAuthUser(), id: null, email: null },
    })
    expect(response).toEqual({})
  })
})

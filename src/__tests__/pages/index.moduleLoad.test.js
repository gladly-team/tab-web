// Tests for module loading, which require resetting modules
// between tests.

import React from 'react'
import { shallow } from 'enzyme'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'

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
jest.mock('src/utils/pageWrappers/withSentry')
jest.mock('src/utils/pageWrappers/logUncaughtErrors')

const getMockProps = () => ({
  data: {
    app: {},
    user: {
      tabs: 221,
      vcCurrent: 78,
      cause: {
        onboarding: {
          steps: [],
        },
      },
    },
  },
})

const setUpAds = () => {
  const { getAdUnits } = require('src/utils/adHelpers')
  const { getAvailableAdUnits } = require('tab-ads')
  getAdUnits.mockReturnValue(getAvailableAdUnits())
}

beforeEach(() => {
  setUpAds()

  // Default to the expected behavior of getServerSideProps functions
  // composing each other's return props.
  const returnComposedProps = async (ctx, getServerSidePropsFunc) => {
    let composedProps = {}
    if (getServerSidePropsFunc) {
      composedProps = await getServerSidePropsFunc(ctx)
    }
    return {
      ...composedProps,
      props: {
        ...composedProps.props,
      },
    }
  }
  const logUncaughtErrors =
    require('src/utils/pageWrappers/logUncaughtErrors').default
  logUncaughtErrors.mockImplementation(
    (getServerSidePropsFunc) => async (ctx) =>
      returnComposedProps(ctx, getServerSidePropsFunc)
  )
  const { withAuthUserTokenSSR } = require('next-firebase-auth')
  withAuthUserTokenSSR.mockImplementation(
    () => (getServerSidePropsFunc) => async (ctx) =>
      returnComposedProps(ctx, getServerSidePropsFunc)
  )
  const { withSentrySSR } = require('src/utils/pageWrappers/withSentry')
  withSentrySSR.mockImplementation(
    (getServerSidePropsFunc) => async (ctx) =>
      returnComposedProps(ctx, getServerSidePropsFunc)
  )
  const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
  withDataSSR.mockImplementation(
    // eslint-disable-next-line no-unused-vars
    (_relayQuery) => (getServerSidePropsFunc) => async (ctx) =>
      returnComposedProps(ctx, getServerSidePropsFunc)
  )
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

  it('calls `withDataSSR` with a function', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    await getServerSideProps()
    expect(withDataSSR).toHaveBeenCalledWith(expect.any(Function))
  })

  it('returns query info from  the "getRelayQuery" passed to `withDataSSR` when we call it with an AuthUser', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    getServerSideProps()
    const getRelayQueryFunc = withDataSSR.mock.calls[0][0]
    const response = await getRelayQueryFunc({ AuthUser: getMockAuthUser() })
    expect(response).toEqual({
      query: expect.any(Object),
      variables: {
        userId: 'mock-user-id',
        charityId: '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z',
      },
    })
  })

  it('returns an empty object from the "getRelayQuery" passed to `withDataSSR` when we call it with an *unauthed* AuthUser', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const withDataSSR = require('src/utils/pageWrappers/withDataSSR').default
    getServerSideProps()
    const getRelayQueryFunc = withDataSSR.mock.calls[0][0]
    const response = await getRelayQueryFunc({
      AuthUser: { ...getMockAuthUser(), id: null, email: null },
    })
    expect(response).toEqual({})
  })

  it('returns an undefined "userAgent" prop value when the User-Agent header is not defined', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const ctx = getMockNextJSContext()
    ctx.req.headers['user-agent'] = undefined
    const response = await getServerSideProps(ctx)
    expect(response).toEqual({
      props: {
        userAgent: undefined,
      },
    })
  })

  it('returns a set "userAgent" prop value when the User-Agent header is defined', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/index')
    const ctx = getMockNextJSContext()
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    ctx.req.headers['user-agent'] = mockUserAgent
    const response = await getServerSideProps(ctx)
    expect(response).toEqual({
      props: {
        userAgent: mockUserAgent,
      },
    })
  })
})

describe('index.js: ads', () => {
  it('calls `fetchAds` on the client side', async () => {
    expect.assertions(1)
    const { isClientSide } = require('src/utils/ssr')
    isClientSide.mockReturnValue(true)
    const { fetchAds } = require('tab-ads')
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    expect(fetchAds).toHaveBeenCalled()
  })

  it('sets the "v4=true" GAM key during fetchAds', async () => {
    expect.assertions(1)
    const { isClientSide } = require('src/utils/ssr')
    isClientSide.mockReturnValue(true)
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    isGAMDevEnvironment.mockReturnValue(false)
    const { fetchAds } = require('tab-ads')
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    const config = fetchAds.mock.calls[0][0]
    expect(config.pageLevelKeyValues.v4).toEqual('true') // should be a string
  })

  it('does not set the "dev" GAM key during fetchAds by default', async () => {
    expect.assertions(1)
    const { isClientSide } = require('src/utils/ssr')
    isClientSide.mockReturnValue(true)
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    isGAMDevEnvironment.mockReturnValue(false)
    const { fetchAds } = require('tab-ads')
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    const config = fetchAds.mock.calls[0][0]
    expect(config.pageLevelKeyValues.dev).toBeUndefined()
  })

  it('sets the "dev=true" GAM key during fetchAds when in a dev environment', async () => {
    expect.assertions(1)
    const { isClientSide } = require('src/utils/ssr')
    isClientSide.mockReturnValue(true)
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    isGAMDevEnvironment.mockReturnValue(true)
    const { fetchAds } = require('tab-ads')
    const IndexPage = require('src/pages/index').default
    const mockProps = getMockProps()
    shallow(<IndexPage {...mockProps} />)
    const config = fetchAds.mock.calls[0][0]
    expect(config.pageLevelKeyValues.dev).toEqual('true') // should be a string
  })
})

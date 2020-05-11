import React from 'react'
import { mount } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import { createAuthUserInfo } from 'src/utils/auth/user'
import FirebaseAuth from 'src/components/FirebaseAuth'
import FullPageLoader from 'src/components/FullPageLoader'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { isClientSide } from 'src/utils/ssr'
import { redirect, setWindowLocation } from 'src/utils/navigation'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import { dashboardURL } from 'src/utils/urls'
import Logo from 'src/components/Logo'

jest.mock('src/components/FirebaseAuth', () => () => (
  <div data-test-id="firebase-auth-mock" />
))
jest.mock('src/components/FullPageLoader', () => () => (
  <div data-test-id="full-page-loader-mock" />
))
jest.mock('src/utils/pageWrappers/withAuthUserInfo')
jest.mock('src/utils/caching')
jest.mock('src/utils/ssr')
jest.mock('src/utils/navigation')
jest.mock('src/components/Logo')

beforeEach(() => {
  isClientSide.mockReturnValue(true)
})

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  AuthUserInfo: createAuthUserInfo({
    AuthUser: null,
    token: null,
    isClientInitialized: true,
  }),
})

describe('auth.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<AuthPage {...mockProps} />)
    }).not.toThrow()
  })

  it('redirects to the app if the AuthUser becomes defined', async () => {
    expect.assertions(2)
    const AuthPage = require('src/containers/auth.js').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      AuthUserInfo: createAuthUserInfo(), // empty AuthUserInfo
    }
    const wrapper = mount(<AuthPage {...mockProps} />)
    await flushAllPromises()
    expect(setWindowLocation).not.toHaveBeenCalled()
    wrapper.setProps({
      ...mockProps,
      AuthUserInfo: createAuthUserInfo({
        AuthUser: {
          id: 'abc-123',
          email: 'fake@example.com',
          emailVerified: true,
        },
        token: 'some-token-here',
        isClientInitialized: true,
      }),
    })
    await flushAllPromises()
    expect(setWindowLocation).toHaveBeenCalledWith(dashboardURL)
  })

  it('clears service worker caches when logging in (when the AuthUser becomes defined)', async () => {
    expect.assertions(2)
    const AuthPage = require('src/containers/auth.js').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      AuthUserInfo: createAuthUserInfo(), // empty AuthUserInfo
    }
    const wrapper = mount(<AuthPage {...mockProps} />)
    await flushAllPromises()
    expect(clearAllServiceWorkerCaches).not.toHaveBeenCalled()
    wrapper.setProps({
      ...mockProps,
      AuthUserInfo: createAuthUserInfo({
        AuthUser: {
          id: 'abc-123',
          email: 'fake@example.com',
          emailVerified: true,
        },
        token: 'some-token-here',
        isClientInitialized: true,
      }),
    })
    await flushAllPromises()
    expect(clearAllServiceWorkerCaches).toHaveBeenCalled()
  })

  it('renders the FirebaseAuth component if the user is not authed and Firebase has initialized', async () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const mockProps = {
      ...getMockProps(),
      AuthUserInfo: createAuthUserInfo({
        AuthUser: null,
        token: null,
        isClientInitialized: true,
      }),
    }
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(FirebaseAuth).exists()).toBe(true)
  })

  it('does not render the FirebaseAuth component if Firebase has not yet initialized', async () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const mockProps = {
      ...getMockProps(),
      AuthUserInfo: createAuthUserInfo({
        AuthUser: null,
        token: null,
        isClientInitialized: false, // still loading
      }),
    }
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(FirebaseAuth).exists()).toBe(false)
  })

  it('renders a loading message when Firebase has not yet initialized', async () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const mockProps = {
      ...getMockProps(),
      AuthUserInfo: createAuthUserInfo({
        AuthUser: null,
        token: null,
        isClientInitialized: false, // still loading
      }),
    }
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(FullPageLoader).exists()).toBe(true)
  })

  it('includes the logo', async () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const mockProps = getMockProps()
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(Logo).exists()).toBe(true)
  })

  it('includes the expected quote', async () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const mockProps = getMockProps()
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(Typography).first().text()).toEqual(
      '"One of the simplest ways to raise money"'
    )
  })

  it('includes the expected quote attribution', async () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const mockProps = getMockProps()
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(Typography).at(1).text()).toEqual('- USA Today')
  })
})

describe('auth.js: getInitialProps', () => {
  beforeEach(() => {
    isClientSide.mockReturnValue(false)
  })

  it('redirects to the dashboard if the user is authed', async () => {
    expect.assertions(1)
    const AuthPage = require('src/containers/auth.js').default
    const ctx = {
      ...getMockNextJSContext(),
      tabCustomData: {
        AuthUserInfo: createAuthUserInfo({
          AuthUser: {
            id: 'abc-123',
            email: 'fake@example.com',
            emailVerified: true,
          },
          token: 'some-token-here',
          isClientInitialized: true,
        }),
      },
    }
    await AuthPage.getInitialProps(ctx)
    expect(redirect).toHaveBeenCalledWith({
      location: dashboardURL,
      ctx,
    })
  })

  it('returns empty initial props if the user is not authed and does not redirect', async () => {
    expect.assertions(2)
    const AuthPage = require('src/containers/auth.js').default
    const ctx = {
      ...getMockNextJSContext(),
      tabCustomData: {
        AuthUserInfo: createAuthUserInfo(), // empty AuthUserInfo
      },
    }
    const response = await AuthPage.getInitialProps(ctx)
    expect(response).toEqual({})
    expect(redirect).not.toHaveBeenCalledWith()
  })
})

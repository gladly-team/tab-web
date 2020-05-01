import React from 'react'
import { mount } from 'enzyme'
import { createAuthUserInfo } from 'src/utils/auth/user'
// import FirebaseAuth from 'src/components/FirebaseAuth'
// import withAuthUserInfo from 'src/utils/pageWrappers/withAuthUserInfo'
// import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { isClientSide } from 'src/utils/ssr'
import { redirect } from 'src/utils/navigation'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import { dashboardURL } from 'src/utils/urls'

jest.mock('src/components/FirebaseAuth', () => () => (
  <div data-test-id="firebase-auth-mock" />
))
jest.mock('src/utils/pageWrappers/withAuthUserInfo')
jest.mock('src/utils/caching')
jest.mock('src/utils/ssr')
jest.mock('src/utils/navigation')

beforeEach(() => {
  isClientSide.mockReturnValue(true)
})

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
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

describe('auth.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<AuthPage {...mockProps} />)
    }).not.toThrow()
  })
})

describe('auth.js: getInitialProps', () => {
  it('redirects to the dashboard if the user is authed', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
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
    const AuthPage = require('src/pages/auth.js').default
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

import React from 'react'
import { shallow } from 'enzyme'
import { useFirebaseAuth } from 'src/utils/auth/hooks'
import { isClientSide, isServerSide } from 'src/utils/ssr'
import {
  // createAuthUser,
  createAuthUserInfo,
  // getAuthUserInfoFromDOM,
} from 'src/utils/auth/user'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import { withSession } from 'src/utils/middleware/session'

jest.mock('next-offline/runtime')
jest.mock('src/utils/auth/hooks')
jest.mock('src/utils/auth/user')
jest.mock('src/utils/middleware/session')
jest.mock('src/utils/ssr')

const MockComponent = () => {
  return <div>hi</div>
}
MockComponent.getInitialProps = jest.fn()

const getMockProps = () => ({
  AuthUserInfo: createAuthUserInfo({
    AuthUser: {
      id: 'abc-123',
      email: 'fake@example.com',
      emailVerified: true,
    },
    token: 'some-token-here',
    isClientInitialized: false,
  }),
  Component: MockComponent,
  pageProps: { some: 'data' },
})

beforeEach(() => {
  // Reset most functions to some defaults.
  MockComponent.getInitialProps.mockReturnValue({
    some: 'data',
  })

  useFirebaseAuth.mockReturnValue({
    initializing: true,
    user: {
      uid: 'abc-123',
      email: 'fake@example.com',
      emailVerified: true,
    },
  })

  isClientSide.mockReturnValue(true)
  isServerSide.mockReturnValue(false)

  withSession.mockImplementation(req => {
    req.cookies = ''
    Object.defineProperty(req, 'session', {
      configurable: true,
      enumerable: true,
      get: jest.fn(),
      set: jest.fn(),
    })
  })
})

describe('_app.js', () => {
  it('renders without error', () => {
    const App = require('src/pages/_app.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<App {...mockProps} />)
    }).not.toThrow()
  })
})

describe('_app.js: getInitialProps', () => {
  it("returns the child component's props as the pageProps [server-side]", async () => {
    expect.assertions(1)
    isClientSide.mockReturnValue(false)
    isServerSide.mockReturnValue(true)
    MockComponent.getInitialProps.mockReturnValue({
      hi: 'there',
      datum: 3.1416,
    })
    const App = require('src/pages/_app.js').default
    const initialProps = await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: true }),
    })
    expect(initialProps.pageProps).toEqual({
      hi: 'there',
      datum: 3.1416,
    })
  })

  it("returns the child component's props as the pageProps [client-side]", async () => {
    expect.assertions(1)
    isClientSide.mockReturnValue(true)
    isServerSide.mockReturnValue(false)
    MockComponent.getInitialProps.mockReturnValue({
      hi: 'there',
      datum: 3.1416,
    })
    const App = require('src/pages/_app.js').default
    const initialProps = await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: false }),
    })
    expect(initialProps.pageProps).toEqual({
      hi: 'there',
      datum: 3.1416,
    })
  })

  it("returns an empty AuthUserInfo object if there isn't a session [server-side]", async () => {
    expect.assertions(1)
    isClientSide.mockReturnValue(false)
    isServerSide.mockReturnValue(true)
    withSession.mockImplementation(req => {
      req.cookies = ''
      Object.defineProperty(req, 'session', {
        configurable: true,
        enumerable: true,
        get: jest.fn(() => undefined), // no session
        set: jest.fn(),
      })
    })
    const App = require('src/pages/_app.js').default
    const initialProps = await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: true }),
    })
    expect(initialProps.AuthUserInfo).toEqual(createAuthUserInfo())
  })

  it('returns a populated AuthUserInfo object if there is a session [server-side]', async () => {
    expect.assertions(1)
    isClientSide.mockReturnValue(false)
    isServerSide.mockReturnValue(true)
    withSession.mockImplementation(req => {
      req.cookies = ''
      Object.defineProperty(req, 'session', {
        configurable: true,
        enumerable: true,
        // Session exists
        get: jest.fn(() => {
          return {
            AuthUserInfo: createAuthUserInfo({
              AuthUser: {
                id: 'user-id-from-session',
                email: 'MrSessionGuy@example.com',
                emailVerified: true,
              },
              token: 'some-token-here',
              isClientInitialized: false,
            }),
          }
        }),
        set: jest.fn(),
      })
    })
    const App = require('src/pages/_app.js').default
    const initialProps = await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: true }),
    })
    expect(initialProps.AuthUserInfo).toEqual({
      AuthUser: {
        id: 'user-id-from-session',
        email: 'MrSessionGuy@example.com',
        emailVerified: true,
      },
      token: 'some-token-here',
      isClientInitialized: false,
    })
  })
})

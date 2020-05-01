import React from 'react'
import { shallow } from 'enzyme'
import { useFirebaseAuth } from 'src/utils/auth/hooks'
import { isClientSide, isServerSide } from 'src/utils/ssr'
import { createAuthUserInfo, getAuthUserInfoFromDOM } from 'src/utils/auth/user'
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

afterEach(() => {
  jest.clearAllMocks()
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

describe('_app.js: getInitialProps [server-side]', () => {
  beforeEach(() => {
    // Set up expected server-side mocks.
    isClientSide.mockReturnValue(false)
    isServerSide.mockReturnValue(true)
    getAuthUserInfoFromDOM.mockImplementation(() => {
      throw new Error(
        'The `getAuthUserInfoFromDOM` cannot be called server-side.'
      )
    })
  })

  afterAll(() => {
    getAuthUserInfoFromDOM.mockReset()
  })

  it("returns the child component's props as the pageProps", async () => {
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

  it("includes the session's AuthUserInfo in the ctx passed to the the child component's getInitialProps", async () => {
    expect.assertions(1)
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
    await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: true }),
    })
    const childComponentCtx = MockComponent.getInitialProps.mock.calls[0][0]
    expect(childComponentCtx.tabCustomData.AuthUserInfo).toEqual({
      AuthUser: {
        id: 'user-id-from-session',
        email: 'MrSessionGuy@example.com',
        emailVerified: true,
      },
      token: 'some-token-here',
      isClientInitialized: false,
    })
  })

  it("returns an empty AuthUserInfo object if there isn't a session", async () => {
    expect.assertions(1)
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

  it('returns a populated AuthUserInfo object if there is a session', async () => {
    expect.assertions(1)
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

describe('_app.js: getInitialProps [client-side]', () => {
  beforeEach(() => {
    // Set up expected client-side mocks.
    isClientSide.mockReturnValue(true)
    isServerSide.mockReturnValue(false)
  })

  it("returns the child component's props as the pageProps", async () => {
    expect.assertions(1)
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

  it("includes the DOM data's AuthUserInfo in the ctx passed to the the child component's getInitialProps", async () => {
    expect.assertions(1)
    getAuthUserInfoFromDOM.mockReturnValue({
      AuthUser: {
        id: 'user-id-from-DOM',
        email: 'MsDOMDataLady@example.com',
        emailVerified: true,
      },
      token: 'some-token-here',
      isClientInitialized: false,
    })
    const App = require('src/pages/_app.js').default
    await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: false }),
    })
    const childComponentCtx = MockComponent.getInitialProps.mock.calls[0][0]
    expect(childComponentCtx.tabCustomData.AuthUserInfo).toEqual({
      AuthUser: {
        id: 'user-id-from-DOM',
        email: 'MsDOMDataLady@example.com',
        emailVerified: true,
      },
      token: 'some-token-here',
      isClientInitialized: false,
    })
  })

  it('returns AuthUserInfo from data stored in the DOM', async () => {
    expect.assertions(1)
    getAuthUserInfoFromDOM.mockReturnValue({
      AuthUser: {
        id: 'user-id-from-DOM',
        email: 'MsDOMDataLady@example.com',
        emailVerified: true,
      },
      token: 'some-token-here',
      isClientInitialized: false,
    })
    const App = require('src/pages/_app.js').default
    const initialProps = await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: false }),
    })
    expect(initialProps.AuthUserInfo).toEqual({
      AuthUser: {
        id: 'user-id-from-DOM',
        email: 'MsDOMDataLady@example.com',
        emailVerified: true,
      },
      token: 'some-token-here',
      isClientInitialized: false,
    })
  })
})

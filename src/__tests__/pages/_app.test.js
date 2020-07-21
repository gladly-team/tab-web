import React from 'react'
import { mount } from 'enzyme'
import { register, unregister } from 'next-offline/runtime'
import * as Sentry from '@sentry/node'
import { AuthUserInfoContext, useFirebaseAuth } from 'src/utils/auth/hooks'
import { isClientSide, isServerSide } from 'src/utils/ssr'
import { createAuthUserInfo, getAuthUserInfoFromDOM } from 'src/utils/auth/user'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import { withSession } from 'src/utils/middleware/session'

jest.mock('next-offline/runtime')
jest.mock('src/utils/auth/hooks')
jest.mock('src/utils/auth/user')
jest.mock('src/utils/middleware/session')
jest.mock('src/utils/ssr')
jest.mock('@sentry/node')

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
  err: undefined,
})

beforeEach(() => {
  // Reset most functions to some defaults.
  MockComponent.getInitialProps.mockReturnValue({
    some: 'data',
  })

  useFirebaseAuth.mockReturnValue({
    initializing: false,
    user: {
      uid: 'abc-123',
      email: 'fake@example.com',
      emailVerified: true,
    },
  })

  isClientSide.mockReturnValue(true)
  isServerSide.mockReturnValue(false)

  withSession.mockImplementation((req) => {
    req.cookies = ''
    Object.defineProperty(req, 'session', {
      configurable: true,
      enumerable: true,
      get: jest.fn(),
      set: jest.fn(),
    })
  })

  process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'true'
  process.env.NEXT_PUBLIC_SENTRY_DSN = 'some-sentry-dsn'
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('_app.js', () => {
  beforeEach(() => {
    // Suppress expected console log.
    jest.spyOn(console, 'log').mockImplementationOnce(() => {})
  })

  it('renders without error', () => {
    expect.assertions(1)
    const App = require('src/pages/_app.js').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<App {...mockProps} />)
    }).not.toThrow()
  })

  it('registers the service worker if process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === "true"', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'true'
    const App = require('src/pages/_app.js').default
    const mockProps = getMockProps()
    mount(<App {...mockProps} />)
    expect(register).toHaveBeenCalledWith('/newtab/service-worker.js')
  })

  it('unregisters the service worker if process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === "false"', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'false'
    const App = require('src/pages/_app.js').default
    const mockProps = getMockProps()
    mount(<App {...mockProps} />)
    expect(unregister).toHaveBeenCalled()
  })

  it('unregisters the service worker if process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED is undefined', () => {
    expect.assertions(1)
    delete process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED
    const App = require('src/pages/_app.js').default
    const mockProps = getMockProps()
    mount(<App {...mockProps} />)
    expect(unregister).toHaveBeenCalled()
  })

  it('provides AuthUserInfo context to consumers, using the server AuthUser if the client-side is still initializing', () => {
    expect.assertions(1)
    const App = require('src/pages/_app.js').default

    // Create a child component with a consumer of the AuthUserInfo context.
    const MockComponentSpy = jest.fn(() => {
      return <div>hey</div>
    })
    const MockComponentWithConsumer = () => {
      return (
        <AuthUserInfoContext.Consumer>
          {(AuthUserInfo) => <MockComponentSpy AuthUserInfo={AuthUserInfo} />}
        </AuthUserInfoContext.Consumer>
      )
    }

    useFirebaseAuth.mockReturnValue({
      initializing: true, // still initializing
      user: undefined,
    })

    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      AuthUserInfo: createAuthUserInfo({
        AuthUser: {
          id: 'abc-123',
          email: 'serverSidePerson@example.com',
          emailVerified: true,
        },
        token: 'some-token-here',
        isClientInitialized: false, // this will always be false on the server side
      }),
      Component: MockComponentWithConsumer,
    }
    mount(<App {...mockProps} />)
    const childComponentProps = MockComponentSpy.mock.calls[0][0]
    expect(childComponentProps.AuthUserInfo).toEqual({
      AuthUser: {
        id: 'abc-123',
        email: 'serverSidePerson@example.com',
        emailVerified: true,
      },
      isClientInitialized: false, // note this is false
      token: 'some-token-here',
    })
  })

  it('provides AuthUserInfo context to consumers, using the client AuthUser if the client-side is finished initializing', () => {
    expect.assertions(1)
    const App = require('src/pages/_app.js').default

    // Create a child component with a consumer of the AuthUserInfo context.
    const MockComponentSpy = jest.fn(() => {
      return <div>hey</div>
    })
    const MockComponentWithConsumer = () => {
      return (
        <AuthUserInfoContext.Consumer>
          {(AuthUserInfo) => <MockComponentSpy AuthUserInfo={AuthUserInfo} />}
        </AuthUserInfoContext.Consumer>
      )
    }

    useFirebaseAuth.mockReturnValue({
      initializing: false, // finished initializing
      user: {
        uid: 'xyz-987',
        email: 'clientSidePerson@example.com',
        emailVerified: true,
      },
    })

    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      AuthUserInfo: createAuthUserInfo({
        AuthUser: {
          id: 'abc-123',
          email: 'serverSidePerson@example.com',
          emailVerified: true,
        },
        token: 'some-token-here',
        isClientInitialized: false, // this will always be false on the server side
      }),
      Component: MockComponentWithConsumer,
    }
    mount(<App {...mockProps} />)
    const childComponentProps = MockComponentSpy.mock.calls[0][0]
    expect(childComponentProps.AuthUserInfo).toEqual({
      AuthUser: {
        id: 'xyz-987',
        email: 'clientSidePerson@example.com',
        emailVerified: true,
      },
      isClientInitialized: true, // note that this is true
      token: 'some-token-here',
    })
  })

  // In this case, the user still has auth cookies but does not have
  // credentials in teh Firebase JS SDK.
  it('provides AuthUserInfo context to consumers, using the client AuthUser (when undefined) if the client-side is finished initializing', () => {
    expect.assertions(1)
    const App = require('src/pages/_app.js').default

    // Create a child component with a consumer of the AuthUserInfo context.
    const MockComponentSpy = jest.fn(() => {
      return <div>hey</div>
    })
    const MockComponentWithConsumer = () => {
      return (
        <AuthUserInfoContext.Consumer>
          {(AuthUserInfo) => <MockComponentSpy AuthUserInfo={AuthUserInfo} />}
        </AuthUserInfoContext.Consumer>
      )
    }

    useFirebaseAuth.mockReturnValue({
      initializing: false, // finished initializing
      user: undefined, // not logged in
    })

    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      AuthUserInfo: createAuthUserInfo({
        AuthUser: {
          id: 'abc-123',
          email: 'serverSidePerson@example.com',
          emailVerified: true,
        },
        token: 'some-token-here',
        isClientInitialized: false, // this will always be false on the server side
      }),
      Component: MockComponentWithConsumer,
    }
    mount(<App {...mockProps} />)
    const childComponentProps = MockComponentSpy.mock.calls[0][0]
    expect(childComponentProps.AuthUserInfo).toEqual({
      AuthUser: null, // not logged in
      isClientInitialized: true, // note that this is true
      token: 'some-token-here',
    })
  })

  // This is a workaround for error logging with Sentry:
  // https://github.com/vercel/next.js/issues/8592
  // https://github.com/vercel/next.js/blob/canary/examples/with-sentry-simple/pages/_app.js
  it('provides the error prop to the child component', () => {
    expect.assertions(1)
    const App = require('src/pages/_app.js').default

    const mockErr = new Error('Some fake error')
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      Component: MockComponent,
      err: mockErr,
    }
    const wrapper = mount(<App {...mockProps} />)
    expect(wrapper.find(MockComponent).prop('err')).toEqual(mockErr)
  })

  it('calls Sentry.setUser when the AuthUser has an ID', () => {
    expect.assertions(1)
    const App = require('src/pages/_app.js').default

    // Create a child component with a consumer of the AuthUserInfo context.
    const MockComponentSpy = jest.fn(() => {
      return <div>hey</div>
    })
    const MockComponentWithConsumer = () => {
      return (
        <AuthUserInfoContext.Consumer>
          {(AuthUserInfo) => <MockComponentSpy AuthUserInfo={AuthUserInfo} />}
        </AuthUserInfoContext.Consumer>
      )
    }

    useFirebaseAuth.mockReturnValue({
      initializing: false,
      user: {
        uid: 'abc-123',
        email: 'somebody@example.com',
        emailVerified: true,
      },
    })

    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      AuthUserInfo: createAuthUserInfo({
        AuthUser: {
          id: 'abc-123',
          email: 'somebody@example.com',
          emailVerified: true,
        },
        token: 'some-token-here',
        isClientInitialized: false,
      }),
      Component: MockComponentWithConsumer,
    }
    mount(<App {...mockProps} />)
    expect(Sentry.setUser).toHaveBeenCalledWith({
      id: 'abc-123',
      email: 'somebody@example.com',
    })
  })

  it('does not call Sentry.setUser when the AuthUser is null', () => {
    expect.assertions(1)
    const App = require('src/pages/_app.js').default

    // Create a child component with a consumer of the AuthUserInfo context.
    const MockComponentSpy = jest.fn(() => {
      return <div>hey</div>
    })
    const MockComponentWithConsumer = () => {
      return (
        <AuthUserInfoContext.Consumer>
          {(AuthUserInfo) => <MockComponentSpy AuthUserInfo={AuthUserInfo} />}
        </AuthUserInfoContext.Consumer>
      )
    }

    useFirebaseAuth.mockReturnValue({
      initializing: false,
      user: null,
    })

    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      AuthUserInfo: createAuthUserInfo({
        AuthUser: null,
        token: undefined,
        isClientInitialized: false,
      }),
      Component: MockComponentWithConsumer,
    }
    mount(<App {...mockProps} />)
    expect(Sentry.setUser).not.toHaveBeenCalled()
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
    expect.assertions(1)
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
    withSession.mockImplementation((req) => {
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
    withSession.mockImplementation((req) => {
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
    withSession.mockImplementation((req) => {
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

  it('calls Sentry.setUser if the AuthUser exists', async () => {
    expect.assertions(1)
    withSession.mockImplementation((req) => {
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
    expect(Sentry.setUser).toHaveBeenCalledWith({
      id: 'user-id-from-session',
      email: 'MrSessionGuy@example.com',
    })
  })

  it('does not call Sentry.setUser if the AuthUser o sniull', async () => {
    expect.assertions(1)
    withSession.mockImplementation((req) => {
      req.cookies = ''
      Object.defineProperty(req, 'session', {
        configurable: true,
        enumerable: true,
        // Session exists
        get: jest.fn(() => undefined),
        set: jest.fn(),
      })
    })
    const App = require('src/pages/_app.js').default
    await App.getInitialProps({
      Component: MockComponent,
      ctx: getMockNextJSContext({ serverSide: true }),
    })
    expect(Sentry.setUser).not.toHaveBeenCalled()
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

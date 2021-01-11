import React from 'react'
import { mount } from 'enzyme'
import { register, unregister } from 'next-offline/runtime'
// import * as Sentry from '@sentry/node'
import { isClientSide, isServerSide } from 'src/utils/ssr'
import { withSession } from 'src/utils/middleware/session'

jest.mock('next-offline/runtime')
jest.mock('src/utils/middleware/session')
jest.mock('src/utils/ssr')
jest.mock('@sentry/node')
jest.mock('src/utils/auth/hooks')

const MockComponent = () => <div>hi</div>
MockComponent.getInitialProps = jest.fn()

const getMockProps = () => ({
  Component: MockComponent,
  pageProps: { some: 'data' },
  err: undefined,
})

beforeEach(() => {
  // Reset most functions to some defaults.
  MockComponent.getInitialProps.mockReturnValue({
    some: 'data',
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

  // FIXME: use next-firebase-auth
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('calls Sentry.setUser when the AuthUser has an ID', () => {
  //   expect.assertions(1)
  //   const App = require('src/pages/_app.js').default
  //   const defaultMockProps = getMockProps()
  //   expect(Sentry.setUser).toHaveBeenCalledWith({
  //     id: 'abc-123',
  //     email: 'somebody@example.com',
  //   })
  // })

  // FIXME: use next-firebase-auth
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('does not call Sentry.setUser when the AuthUser is null', () => {
  //   expect.assertions(1)
  //   const App = require('src/pages/_app.js').default
  //   mount(<App {...mockProps} />)
  //   expect(Sentry.setUser).not.toHaveBeenCalled()
  // })
})

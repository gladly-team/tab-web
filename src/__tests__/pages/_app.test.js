import React from 'react'
import { mount } from 'enzyme'
import { register, unregister } from 'next-offline/runtime'
import { isClientSide, isServerSide } from 'src/utils/ssr'

jest.mock('next-offline/runtime')
jest.mock('src/utils/ssr')
jest.mock('src/utils/auth/initAuth')

// Don't enforce env vars during unit tests.
jest.mock('src/utils/ensureValuesAreDefined')

const MockComponent = () => <div>hi</div>

const getMockProps = () => ({
  Component: MockComponent,
  pageProps: { some: 'data' },
  err: undefined,
})

beforeEach(() => {
  isClientSide.mockReturnValue(true)
  isServerSide.mockReturnValue(false)
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
})

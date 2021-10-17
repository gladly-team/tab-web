import React from 'react'
import { mount } from 'enzyme'
import { register, unregister } from 'next-offline/runtime'
import { isClientSide, isServerSide } from 'src/utils/ssr'
import useTheme from 'src/utils/hooks/useThemeContext'
import { act } from 'react-dom/test-utils'
import PropTypes from 'prop-types'

jest.mock('next/router')
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
    const App = require('src/pages/_app').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<App {...mockProps} />)
    }).not.toThrow()
  })

  it('registers the service worker if process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === "true"', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'true'
    const App = require('src/pages/_app').default
    const mockProps = getMockProps()
    mount(<App {...mockProps} />)
    expect(register).toHaveBeenCalledWith('/newtab/service-worker.js')
  })

  it('unregisters the service worker if process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === "false"', () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED = 'false'
    const App = require('src/pages/_app').default
    const mockProps = getMockProps()
    mount(<App {...mockProps} />)
    expect(unregister).toHaveBeenCalled()
  })

  it('unregisters the service worker if process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED is undefined', () => {
    expect.assertions(1)
    delete process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED
    const App = require('src/pages/_app').default
    const mockProps = getMockProps()
    mount(<App {...mockProps} />)
    expect(unregister).toHaveBeenCalled()
  })

  it('sets the default theme value in the theme context and updates theme with hook', () => {
    expect.assertions(2)
    const App = require('src/pages/_app').default
    let setThemeFunction
    // eslint-disable-next-line no-unused-vars
    const ThemeInProp = ({ theme }) => <div />
    ThemeInProp.propTypes = {
      // eslint-disable-next-line react/forbid-prop-types
      theme: PropTypes.any.isRequired,
    }
    const ThemedComponent = () => {
      const { theme, setTheme } = useTheme()
      setThemeFunction = setTheme
      return <ThemeInProp theme={theme} />
    }

    const mockProps = getMockProps()
    const wrapper = mount(<App {...mockProps} Component={ThemedComponent} />)
    expect(
      wrapper.find(ThemeInProp).prop('theme').palette.primary.main
    ).toEqual('#9d4ba3')
    act(() => {
      setThemeFunction({ primaryColor: '#fff', secondayColor: '#fff' })
    })
    wrapper.update()
    expect(
      wrapper.find(ThemeInProp).prop('theme').palette.primary.main
    ).toEqual('#fff')
  })
})

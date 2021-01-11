import React from 'react'
import { mount } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Logo from 'src/components/Logo'
import { isClientSide } from 'src/utils/ssr'

jest.mock('src/components/FirebaseAuth', () => () => (
  <div data-test-id="firebase-auth-mock" />
))
jest.mock('src/components/FullPageLoader', () => () => (
  <div data-test-id="full-page-loader-mock" />
))
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

const getMockProps = () => ({})

describe('auth.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<AuthPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes the logo', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(Logo).exists()).toBe(true)
  })

  it('includes the expected quote', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(Typography).first().text()).toEqual(
      '"One of the simplest ways to raise money"'
    )
  })

  it('includes the expected quote attribution', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = mount(<AuthPage {...mockProps} />)
    expect(wrapper.find(Typography).at(1).text()).toEqual('- USA Today')
  })
})

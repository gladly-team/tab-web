import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'
import { isClientSide } from 'src/utils/ssr'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import FullPageLoader from 'src/components/FullPageLoader'
import { dashboardURL } from 'src/utils/urls'

jest.mock('react-firebaseui/StyledFirebaseAuth')
jest.mock('firebase/app')
jest.mock('firebase/auth')
jest.mock('src/components/FullPageLoader', () => () => (
  <div data-test-id="full-page-loader-mock" />
))
jest.mock('src/utils/ssr')

const getMockProps = () => ({
  onSuccessfulAuth: undefined,
})

beforeEach(() => {
  isClientSide.mockReturnValue(true)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('FirebaseAuth component', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<FirebaseAuth {...mockProps} />)
    }).not.toThrow()
  })

  it('returns an empty div when rendering on the server side', () => {
    expect.assertions(2)
    isClientSide.mockReturnValue(false)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    expect(wrapper.at(0).contains(<div />)).toBe(true)
    expect(wrapper.find(StyledFirebaseAuth).exists()).toBe(false)
  })

  it('returns StyledFirebaseAuth when rendering on the client side', () => {
    expect.assertions(1)
    isClientSide.mockReturnValue(true)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    expect(wrapper.find(StyledFirebaseAuth).exists()).toBe(true)
  })

  it('passes an object to StyledFirebaseAuth\'s "uiConfig" prop', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    expect(wrapper.find(StyledFirebaseAuth).prop('uiConfig')).toEqual(
      expect.any(Object)
    )
  })

  it('sets the FirebaseUI signInFlow to "popup"', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
    expect(firebaseUIConfig.signInFlow).toEqual('popup')
  })

  it('sets the expected FirebaseUI signInOptions', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
    expect(firebaseUIConfig.signInOptions).toEqual([
      {
        provider: 'google.com',
        scopes: ['https://www.googleapis.com/auth/userinfo.email'],
      },
      {
        provider: 'facebook.com',
        scopes: ['email'],
      },
      {
        provider: 'password',
        requireDisplayName: false,
      },
    ])
  })

  it('sets the FirebaseUI signInSuccessUrl to the dashbaord URL', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
    expect(firebaseUIConfig.signInSuccessUrl).toEqual(dashboardURL)
  })

  it('sets the correct FirebaseUI terms of service URL', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
    expect(firebaseUIConfig.tosUrl).toEqual('https://tab.gladly.io/terms/')
  })

  it('sets the correct FirebaseUI privacy policy URL', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
    expect(firebaseUIConfig.privacyPolicyUrl).toEqual(
      'https://tab.gladly.io/privacy/'
    )
  })

  it('returns a loader component when the signInSuccessWithAuthResult callback is called', () => {
    expect.assertions(2)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    expect(wrapper.find(FullPageLoader).exists()).toBe(false)
    act(() => {
      const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
      firebaseUIConfig.callbacks.signInSuccessWithAuthResult()
    })
    wrapper.update()
    expect(wrapper.find(FullPageLoader).exists()).toBe(true)
  })

  it('calls the "onSuccessfulAuth" prop when the signInSuccessWithAuthResult callback is called', () => {
    expect.assertions(2)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = {
      ...getMockProps(),
      onSuccessfulAuth: jest.fn(),
    }
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    expect(mockProps.onSuccessfulAuth).not.toHaveBeenCalled()
    act(() => {
      const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
      firebaseUIConfig.callbacks.signInSuccessWithAuthResult()
    })
    expect(mockProps.onSuccessfulAuth).toHaveBeenCalledTimes(1)
  })

  it('returns false from the signInSuccessWithAuthResult callback, which ensures we handle the auth redirect ourselves', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    const wrapper = mount(<FirebaseAuth {...mockProps} />)
    act(() => {
      const firebaseUIConfig = wrapper.find(StyledFirebaseAuth).prop('uiConfig')
      expect(firebaseUIConfig.callbacks.signInSuccessWithAuthResult()).toBe(
        false
      )
    })
  })
})

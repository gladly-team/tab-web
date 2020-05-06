import React from 'react'
import { mount } from 'enzyme'
import initFirebase from 'src/utils/auth/initFirebase'
import { isClientSide } from 'src/utils/ssr'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

jest.mock('react-firebaseui/StyledFirebaseAuth')
jest.mock('firebase/app')
jest.mock('firebase/auth')
jest.mock('src/components/FullPageLoader', () => () => (
  <div data-test-id="full-page-loader-mock" />
))
jest.mock('src/utils/ssr')
jest.mock('src/utils/auth/initFirebase')

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

  it('calls initFirebase on mount', () => {
    expect.assertions(2)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    expect(initFirebase).not.toHaveBeenCalled()
    const mockProps = getMockProps()
    mount(<FirebaseAuth {...mockProps} />)
    expect(initFirebase).toHaveBeenCalled()
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
})

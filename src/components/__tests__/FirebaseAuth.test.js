import React from 'react'
import { shallow } from 'enzyme'
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
// import FullPageLoader from 'src/components/FullPageLoader'
// import { dashboardURL } from 'src/utils/urls'

jest.mock('react-firebaseui/StyledFirebaseAuth', () => () => (
  <div data-test-id="styled-firebase-auth-mock" />
))
jest.mock('firebase/app', () => ({
  auth: {
    EmailAuthProvider: {
      PROVIDER_ID: 'password',
    },
    FacebookAuthProvider: {
      PROVIDER_ID: 'facebook.com',
    },
    GoogleAuthProvider: {
      PROVIDER_ID: 'google.com',
    },
  },
}))
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
  const { isClientSide } = require('src/utils/ssr')
  isClientSide.mockReturnValue(true)
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules() // calls initFirebase on module load
})

describe('FirebaseAuth component', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<FirebaseAuth {...mockProps} />)
    }).not.toThrow()
  })

  it('calls initFirebase on module load', () => {
    expect.assertions(2)
    const initFirebase = require('src/utils/auth/initFirebase').default
    expect(initFirebase).not.toHaveBeenCalled()
    require('src/components/FirebaseAuth').default // eslint-disable-line
    expect(initFirebase).toHaveBeenCalled()
  })
})

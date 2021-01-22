import React from 'react'
import { shallow } from 'enzyme'

jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/components/FirebaseAuth', () => () => (
  <div data-test-id="firebase-auth-mock" />
))
jest.mock('src/components/FullPageLoader', () => () => (
  <div data-test-id="full-page-loader-mock" />
))
jest.mock('src/components/Logo')

const getMockProps = () => ({})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('auth.js: HOC', () => {
  it('calls `withAuthUser`, with a render/redirect-if-unauthed strategy', () => {
    expect.assertions(1)
    const { withAuthUser, AuthAction } = require('next-firebase-auth')
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    shallow(<AuthPage {...mockProps} />)
    expect(withAuthUser).toHaveBeenCalledWith({
      whenAuthed: AuthAction.REDIRECT_TO_APP,
      whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
      whenUnauthedAfterInit: AuthAction.RENDER,
    })
  })

  it('calls `withRelay`', () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    shallow(<AuthPage {...mockProps} />)
    expect(withRelay).toHaveBeenCalled()
  })
})

describe('auth.js: getServerSideProps', () => {
  it('does not define getServerSideProps', () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/auth.js')
    expect(getServerSideProps).toBeUndefined()
  })
})

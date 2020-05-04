import React from 'react'
import { shallow } from 'enzyme'
// import { createAuthUserInfo } from 'src/utils/auth/user'

const getMockProps = () => ({
  // AuthUserInfo: createAuthUserInfo({
  //   AuthUser: null,
  //   token: null,
  //   isClientInitialized: true,
  // }),
})

describe('account.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AccountPage {...mockProps} />)
    }).not.toThrow()
  })
})

describe('auth.js: getInitialProps', () => {
  it('does not define getInitialProps', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    expect(AccountPage.getInitialProps).toBeUndefined()
  })
})

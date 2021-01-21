import React from 'react'
import { shallow } from 'enzyme'

jest.mock('next-offline/runtime')
jest.mock('src/components/SettingsPage')
jest.mock('src/utils/auth/logout')
jest.mock('src/utils/caching')
jest.mock('src/utils/navigation')
jest.mock('src/utils/mutations/SetV4BetaMutation')
jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/utils/hooks/useData')

const getMockProps = () => ({})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('account.js: HOC', () => {
  it('calls `withAuthUser`, with a render/redirect-if-unauthed strategy', () => {
    expect.assertions(1)
    const { withAuthUser, AuthAction } = require('next-firebase-auth')
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    shallow(<AccountPage {...mockProps} />)
    expect(withAuthUser).toHaveBeenCalledWith({
      whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    })
  })

  it('calls `withRelay`', () => {
    expect.assertions(1)
    const { withAuthUser, AuthAction } = require('next-firebase-auth')
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const AccountPage = require('src/pages/account.js').default
    const mockProps = getMockProps()
    shallow(<AccountPage {...mockProps} />)
    expect(withRelay).toHaveBeenCalled()
  })
})

describe('account.js: getServerSideProps', () => {
  it('does not define getServerSideProps', () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/account.js')
    expect(getServerSideProps).toBeUndefined()
  })
})

import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
import logout from 'src/utils/auth/logout'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'

jest.mock('src/components/SettingsPage')
jest.mock('src/utils/pageWrappers/withAuthAndData')
jest.mock('src/utils/auth/logout')

const getMockProps = () => ({
  user: {
    email: 'fakeEmail@example.com',
    username: 'IAmFake',
  },
})

afterEach(() => {
  jest.clearAllMocks()
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

  it('returns a SettingsPage component', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    expect(wrapper.at(0).type()).toEqual(SettingsPage)
  })

  it('has an "Account" title', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const title = content.childAt(0).find(Typography).first()
    expect(title.text()).toEqual('Account')
  })

  it('has a logout button', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.exists()).toBe(true)
  })

  it('displays the expected text on the logout button', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logoutButton.text()).toEqual('Log Out')
  })

  it('calls `logout` when clicking the logout button', async () => {
    expect.assertions(2)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const logoutButton = wrapper.find(Button).first()
    expect(logout).not.toHaveBeenCalled()
    logoutButton.simulate('click')
    await flushAllPromises()
    expect(logout).toHaveBeenCalled()
  })

  it('displays a Divider after the title', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(1)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays the user's username", () => {
    expect.assertions(2)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(2).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Username')
    expect(accountItem.find(Typography).at(1).text()).toEqual('IAmFake')
  })

  it('displays a Divider after the username info', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(3)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays the user's email address", () => {
    expect.assertions(2)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper.at(0).dive().find(Paper).first()
    const accountItem = content.childAt(4).dive()
    expect(accountItem.find(Typography).first().text()).toEqual('Email')
    expect(accountItem.find(Typography).at(1).text()).toEqual(
      'fakeEmail@example.com'
    )
  })
})

describe('account.js: getInitialProps', () => {
  it('does not define getInitialProps', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    expect(AccountPage.getInitialProps).toBeUndefined()
  })
})

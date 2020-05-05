import React from 'react'
import { shallow } from 'enzyme'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'

jest.mock('src/components/SettingsPage')
jest.mock('src/utils/pageWrappers/withAuthAndData')

const getMockProps = () => ({
  user: {
    email: 'fakeEmail@example.com',
    username: 'IAmFake',
  },
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
    expect.assertions(2)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper
      .at(0)
      .dive()
      .find(Paper)
      .first()
    const accountItem = content.childAt(0)
    expect(accountItem.type()).toEqual(Typography)
    expect(accountItem.text()).toEqual('Account')
  })

  it('displays a Divider after the title', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper
      .at(0)
      .dive()
      .find(Paper)
      .first()
    const accountItem = content.childAt(1)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays the user's username", () => {
    expect.assertions(2)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper
      .at(0)
      .dive()
      .find(Paper)
      .first()
    const accountItem = content.childAt(2).dive()
    expect(
      accountItem
        .find(Typography)
        .first()
        .text()
    ).toEqual('Username')
    expect(
      accountItem
        .find(Typography)
        .at(1)
        .text()
    ).toEqual('IAmFake')
  })

  it('displays a Divider after the username info', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper
      .at(0)
      .dive()
      .find(Paper)
      .first()
    const accountItem = content.childAt(3)
    expect(accountItem.type()).toEqual(Divider)
  })

  it("displays the user's email address", () => {
    expect.assertions(2)
    const AccountPage = require('src/containers/account.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AccountPage {...mockProps} />)
    const content = wrapper
      .at(0)
      .dive()
      .find(Paper)
      .first()
    const accountItem = content.childAt(4).dive()
    expect(
      accountItem
        .find(Typography)
        .first()
        .text()
    ).toEqual('Email')
    expect(
      accountItem
        .find(Typography)
        .at(1)
        .text()
    ).toEqual('fakeEmail@example.com')
  })
})

describe('account.js: getInitialProps', () => {
  it('does not define getInitialProps', () => {
    expect.assertions(1)
    const AccountPage = require('src/containers/account.js').default
    expect(AccountPage.getInitialProps).toBeUndefined()
  })
})

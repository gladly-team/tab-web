import React from 'react'
import { shallow } from 'enzyme'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
import { accountURL, dashboardURL } from 'src/utils/urls'

jest.mock('src/components/Link')
jest.mock('src/components/Logo')

const getMockProps = () => ({
  children: <div>I am a child</div>,
})

describe('SettingsPage component', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const SettingsPage = require('src/components/SettingsPage.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SettingsPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes a logo in the app bar toolbar', () => {
    expect.assertions(3)
    const SettingsPage = require('src/components/SettingsPage.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const toolbar = wrapper
      .find(AppBar)
      .find(Toolbar)
      .first()
    const logo = toolbar.find(Logo)
    expect(logo.exists()).toBe(true)
    expect(logo.prop('includeText')).not.toBe(true)
    expect(logo.prop('color')).toEqual('white')
  })

  it('includes a close button in the app bar toolbar which links to the dashboard', () => {
    expect.assertions(3)
    const SettingsPage = require('src/components/SettingsPage.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const toolbar = wrapper
      .find(AppBar)
      .find(Toolbar)
      .first()
    const link = toolbar
      .find(Link)
      .filterWhere(elem => elem.prop('to') === dashboardURL)
    expect(link.exists()).toBe(true)
    expect(link.childAt(0).type()).toEqual(IconButton)
    expect(
      link
        .childAt(0)
        .childAt(0)
        .type()
    ).toEqual(CloseIcon)
  })

  it('includes the "Your Profile" subheader in the sidebar list', () => {
    expect.assertions(1)
    const SettingsPage = require('src/components/SettingsPage.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const sidebarList = wrapper.find(List).first()

    // First subheader.
    expect(sidebarList.childAt(0).text()).toEqual('Your Profile')
  })

  it('includes the account link in the sidebar list', () => {
    expect.assertions(3)
    const SettingsPage = require('src/components/SettingsPage.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const sidebarList = wrapper.find(List).first()

    // First link.
    const item = sidebarList.childAt(1).dive()
    expect(item.render().text()).toEqual('Account')
    expect(item.type()).toEqual(Link)
    expect(item.prop('to')).toEqual(accountURL)
  })

  it('renders children in the main content container', () => {
    expect.assertions(1)
    const SettingsPage = require('src/components/SettingsPage.js').default
    const mockProps = {
      ...getMockProps(),
      children: (
        <div>
          <span>Hi</span> there!
        </div>
      ),
    }
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    expect(
      wrapper
        .find('[data-test-id="settings-content"]')
        .contains(mockProps.children)
    ).toBe(true)
  })
})

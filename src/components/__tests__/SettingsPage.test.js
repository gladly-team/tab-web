import React from 'react'
import { shallow } from 'enzyme'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Toolbar from '@material-ui/core/Toolbar'
import CloseIcon from '@material-ui/icons/Close'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
import { aboutURL, accountURL, dashboardURL, surveyLink } from 'src/utils/urls'
import { withBasePath } from 'src/utils/navigationUtils'
import Footer from 'src/components/Footer'

jest.mock('src/components/Link')
jest.mock('src/components/Logo')
jest.mock('src/utils/featureFlags')

const getMockProps = () => ({
  children: <div>I am a child</div>,
})

describe('SettingsPage component', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const SettingsPage = require('src/components/SettingsPage').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SettingsPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes a logo in the app bar toolbar', () => {
    expect.assertions(3)
    const SettingsPage = require('src/components/SettingsPage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const toolbar = wrapper.find(AppBar).find(Toolbar).first()
    const logo = toolbar.find(Logo)
    expect(logo.exists()).toBe(true)
    expect(logo.prop('includeText')).not.toBe(true)
    expect(logo.prop('color')).toEqual('white')
  })

  it('includes a close button in the app bar toolbar which links to the dashboard', () => {
    expect.assertions(3)
    const SettingsPage = require('src/components/SettingsPage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const toolbar = wrapper.find(AppBar).find(Toolbar).first()
    const link = toolbar
      .find('a')
      .filterWhere((elem) => elem.prop('href') === withBasePath(dashboardURL))
    expect(link.exists()).toBe(true)
    expect(link.childAt(0).type()).toEqual(IconButton)
    expect(link.childAt(0).childAt(0).type()).toEqual(CloseIcon)
  })

  it('includes the account link in the sidebar list', () => {
    expect.assertions(3)

    const SettingsPage = require('src/components/SettingsPage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const sidebarList = wrapper.find(List).first()

    const item = sidebarList
      .findWhere((elem) => elem.render().text() === 'Account')
      .dive()
    expect(item.exists()).toBe(true)
    expect(item.type()).toEqual(Link)
    expect(item.prop('to')).toEqual(accountURL)
  })

  it('includes the "about" link in the sidebar list', () => {
    expect.assertions(3)

    const SettingsPage = require('src/components/SettingsPage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const sidebarList = wrapper.find(List).first()

    const item = sidebarList
      .findWhere((elem) => elem.render().text() === 'About the Cause')
      .dive()
    expect(item.exists()).toBe(true)
    expect(item.type()).toEqual(Link)
    expect(item.prop('to')).toEqual(aboutURL)
  })

  it('renders children in the main content container', () => {
    expect.assertions(1)
    const SettingsPage = require('src/components/SettingsPage').default
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

  it('includes a feedback survey link', () => {
    expect.assertions(2)
    const SettingsPage = require('src/components/SettingsPage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    const sidebarList = wrapper.find(List).first()

    const item = sidebarList.findWhere(
      (elem) => elem.render().text() === 'Feedback'
    )
    expect(item.exists()).toBe(true)
    expect(item.prop('to')).toEqual(surveyLink)
  })

  it('renders a footer', () => {
    const SettingsPage = require('src/components/SettingsPage').default
    const mockProps = getMockProps()
    const wrapper = shallow(<SettingsPage {...mockProps} />)
    expect(wrapper.find(Footer)).toHaveLength(1)
  })
})

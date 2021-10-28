import React from 'react'
import { shallow, mount } from 'enzyme'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { reload, externalNavigation } from 'src/utils/urls'

jest.mock('src/components/Link')
jest.mock('src/utils/urls', () => ({
  reload: jest.fn(),
  externalNavigation: jest.fn(),
  EXTERNAL_CONTACT_US_URL: 'https://example.com/help/',
  EXTERNAL_CLEAR_COOKIES_HELP_PAGE: 'https://example.com/help/specific-thing/',
}))

describe('ErrorPage component', () => {
  it('renders without error', () => {
    const ErrorPage = require('src/components/ErrorPage').default
    expect(() => {
      shallow(<ErrorPage />)
    }).not.toThrow()
  })

  it('fires a page reload when the reload button is clicked', () => {
    expect.assertions(1)
    const ErrorPage = require('src/components/ErrorPage').default
    const wrapper = shallow(<ErrorPage />)
    const reloadButton = wrapper
      .find(Button)
      .filterWhere((elem) => elem.render().text() === 'Reload')
    reloadButton.simulate('click')
    expect(reload).toHaveBeenCalled()
  })

  it('has the expected text', () => {
    expect.assertions(1)
    const ErrorPage = require('src/components/ErrorPage').default
    const wrapper = mount(<ErrorPage />)
    const infoText = wrapper.find(Typography).at(1)
    expect(infoText.text()).toEqual(
      'Please try clearing your cookies or reloading, then contact us if the problem continues.'
    )
  })

  it('links to a help article about clearing cookies', () => {
    expect.assertions(3)
    const ErrorPage = require('src/components/ErrorPage').default
    const wrapper = shallow(<ErrorPage />)
    const infoText = wrapper.find(Typography).at(1)
    const link = infoText.find('a')
    expect(link.dive().text()).toEqual('clearing your cookies')
    expect(link.prop('to')).toEqual('https://example.com/help/specific-thing/')
    expect(link.prop('target')).toEqual('_blank')
  })

  it('fires a link to customer support when user clicks Contact us', () => {
    expect.assertions(1)
    const ErrorPage = require('src/components/ErrorPage').default
    const wrapper = shallow(<ErrorPage />)
    const contactButton = wrapper
      .find(Button)
      .filterWhere((elem) => elem.render().text() === 'Contact us')
    contactButton.simulate('click')
    expect(externalNavigation).toHaveBeenCalled()
  })
})

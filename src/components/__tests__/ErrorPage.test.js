import React from 'react'
import { shallow } from 'enzyme'
import Button from '@material-ui/core/Button'
import { reload, externalNavigation } from 'src/utils/urls'

jest.mock('src/utils/urls', () => ({
  reload: jest.fn(),
  externalNavigation: jest.fn(),
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
    const impactTextElem = wrapper
      .find(Button)
      .filterWhere((elem) => elem.render().text() === 'Reload')
    impactTextElem.simulate('click')
    expect(reload).toHaveBeenCalled()
  })

  it('fires a link to customer support when user clicks Contact us', () => {
    expect.assertions(1)
    const ErrorPage = require('src/components/ErrorPage').default
    const wrapper = shallow(<ErrorPage />)
    const impactTextElem = wrapper
      .find(Button)
      .filterWhere((elem) => elem.render().text() === 'Contact us')
    impactTextElem.simulate('click')
    expect(externalNavigation).toHaveBeenCalled()
  })
})

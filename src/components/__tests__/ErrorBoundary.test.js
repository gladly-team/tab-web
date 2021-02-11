/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import Logo from 'src/components/Logo'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
// import { externalContactUsURL } from 'src'
// import { externalRedirect } from 'js/navigation/utils'
import logger from 'src/utils/logger'
import {
  EXTERNAL_CONTACT_US_URL,
  reload,
  externalNavigation,
} from 'src/utils/urls'

jest.mock('src/utils/urls', () => ({
  reload: jest.fn(),
  externalNavigation: jest.fn(),
}))
jest.mock('src/components/Logo')
jest.mock('src/utils/logger')
// jest.mock('global')
const getMockProps = () => ({
  brand: 'tab',
  ignoreErrors: false,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders without error', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(
        <ErrorBoundary {...mockProps}>
          <div />
        </ErrorBoundary>
      )
    }).not.toThrow()
  })

  it('logs when an error is thrown', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    const err = new Error('Uh oh.')
    const ProblemComponent = () => null
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <ProblemComponent />
      </ErrorBoundary>
    )
    wrapper.find(ProblemComponent).simulateError(err)
    expect(logger.error).toHaveBeenCalledWith(err)
  })

  it('returns the children until an error is thrown', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    expect(wrapper.find('div').first().text()).toBe('hey there')
    wrapper.setState({ hasError: true })
    expect(wrapper.find(Typography).first().text()).toBe('Oops!')
    expect(wrapper.find(Typography).at(1).text()).toBe(
      'There was an error on the page. Please try reloading, or contact us if the problem continues.'
    )
  })

  it('shows the logo with expected props', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    const logoComponent = wrapper.find(Logo)
    expect(logoComponent.prop('includeText')).toBe('true')
    expect(logoComponent.prop('style')).toEqual({
      height: 40,
    })
  })

  it('shows a button to contact us', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    expect(
      wrapper
        .find(Button)
        .filterWhere((node) => node.render().text() === 'Contact us').length
    ).toBe(1)
  })

  it('sends the user to the contact page when they click the "contact us" button', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    const contactButton = wrapper
      .find(Button)
      .filterWhere((node) => node.render().text() === 'Contact us')
      .first()
    contactButton.simulate('click')
    expect(externalNavigation).toHaveBeenCalledWith(EXTERNAL_CONTACT_US_URL)
  })

  it('shows a button to reload the page', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    expect(
      wrapper
        .find(Button)
        .filterWhere((node) => node.render().text() === 'Reload').length
    ).toBe(1)
  })

  it('reloads the page when the user clicks the "reload" button', () => {
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const mockProps = getMockProps()
    const wrapper = mount(
      <ErrorBoundary {...mockProps}>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    const reloadButton = wrapper
      .find(Button)
      .filterWhere((node) => node.render().text() === 'Reload')
      .first()
    reloadButton.simulate('click')
    expect(reload).toHaveBeenCalledTimes(1)
  })
})

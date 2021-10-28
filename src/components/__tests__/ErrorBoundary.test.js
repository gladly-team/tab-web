/* eslint-env jest */

import React from 'react'
import { mount, shallow } from 'enzyme'
import logger from 'src/utils/logger'
import ErrorPage from 'src/components/ErrorPage'

jest.mock('src/components/ErrorPage', () => () => (
  <div>Error page text here.</div>
))
jest.mock('src/utils/urls', () => ({
  reload: jest.fn(),
  externalNavigation: jest.fn(),
}))
jest.mock('src/components/Logo')
jest.mock('src/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
})

describe('ErrorBoundary', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    expect(() => {
      shallow(
        <ErrorBoundary>
          <div />
        </ErrorBoundary>
      )
    }).not.toThrow()
  })

  it('logs when an error is thrown', () => {
    expect.assertions(1)
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const err = new Error('Uh oh.')
    const ProblemComponent = () => null
    const wrapper = mount(
      <ErrorBoundary>
        <ProblemComponent />
      </ErrorBoundary>
    )
    wrapper.find(ProblemComponent).simulateError(err)
    expect(logger.error).toHaveBeenCalledWith(err)
  })

  it('returns the children until an error is thrown', () => {
    expect.assertions(2)
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const wrapper = mount(
      <ErrorBoundary>
        <div>hey there</div>
      </ErrorBoundary>
    )
    expect(wrapper.find('div').first().text()).toBe('hey there')
    wrapper.setState({ hasError: true })
    expect(wrapper.text()).toEqual('Error page text here.')
  })

  it('returns the ErrorPage component', () => {
    expect.assertions(1)
    const ErrorBoundary = require('src/components/ErrorBoundary').default
    const wrapper = mount(
      <ErrorBoundary>
        <div>hey there</div>
      </ErrorBoundary>
    )
    wrapper.setState({ hasError: true })
    expect(wrapper.find(ErrorPage).exists()).toBe(true)
  })
})

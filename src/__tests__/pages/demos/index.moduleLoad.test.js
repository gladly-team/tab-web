import React from 'react'
import { shallow } from 'enzyme'

jest.mock('next-firebase-auth')
jest.mock('src/utils/featureFlags')
jest.mock('src/utils/pageWrappers/return404If')
jest.mock('src/components/Achievement', () => () => (
  <div data-test-id="mock-achievement" />
))

const getMockProps = () => ({})

beforeEach(() => {
  const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
  showDevelopmentOnlyDemoPages.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('demos/index.js: HOC', () => {
  it('passes true to return404If when we should not show the achievements page', () => {
    expect.assertions(1)
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    showDevelopmentOnlyDemoPages.mockReturnValue(false)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const DemoPage = require('src/pages/demos/index').default
    const mockProps = getMockProps()
    shallow(<DemoPage {...mockProps} />)
    expect(return404If).toHaveBeenCalledWith(true)
  })

  it('passes false to return404If when we should show the achievements page', () => {
    expect.assertions(1)
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    showDevelopmentOnlyDemoPages.mockReturnValue(true)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const DemoPage = require('src/pages/demos/index').default
    const mockProps = getMockProps()
    shallow(<DemoPage {...mockProps} />)
    expect(return404If).toHaveBeenCalledWith(false)
  })
})

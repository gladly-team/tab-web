import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Achievement from 'src/components/Achievement'

jest.mock('src/utils/featureFlags')
jest.mock('src/utils/pageWrappers/return404If')
jest.mock('src/components/Achievement')

const getMockProps = () => ({})

beforeEach(() => {
  const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
  showDevelopmentOnlyDemoPages.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()

  // See below regarding:
  // https://github.com/facebook/jest/issues/8987
  // jest.resetModules()
})

// To test the higher-order components, we need to reset modules,
// but that's causing an error with hooks:
// https://github.com/facebook/jest/issues/8987

describe('achievement-component demo page', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AchievementComponentDemoPage = require('src/containers/demos/achievement-component')
      .default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AchievementComponentDemoPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes the title', () => {
    expect.assertions(1)
    const AchievementComponentDemoPage = require('src/containers/demos/achievement-component')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<AchievementComponentDemoPage {...mockProps} />)
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.prop('variant') === 'h3')
        .first()
        .render()
        .text()
    ).toEqual('Demos of Achievement Types')
  })

  it('includes many Achievement components', () => {
    expect.assertions(1)
    const AchievementComponentDemoPage = require('src/containers/demos/achievement-component')
      .default
    const mockProps = getMockProps()
    const wrapper = shallow(<AchievementComponentDemoPage {...mockProps} />)
    expect(wrapper.find(Achievement).length).toBeGreaterThan(10)
  })
})

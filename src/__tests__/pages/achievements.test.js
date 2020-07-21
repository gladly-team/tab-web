import React from 'react'
import { shallow } from 'enzyme'
import Achievement from 'src/components/Achievement'

jest.mock('src/utils/featureFlags')
jest.mock('src/utils/pageWrappers/return404If')
jest.mock('src/components/Achievement', () => () => (
  <div data-test-id="mock-achievement" />
))

const getMockProps = () => ({})

beforeEach(() => {
  const { showMockAchievements } = require('src/utils/featureFlags')
  showMockAchievements.mockReturnValue(false)
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
// Disabling until resolved.
/* eslint-disable jest/no-commented-out-tests */

// describe('achievements.js: HOC wrappers', () => {
//   it('passes true to return404If when we should not show the achievements page', () => {
//     expect.assertions(1)
//     const { showMockAchievements } = require('src/utils/featureFlags')
//     showMockAchievements.mockReturnValue(false)
//     const return404If = require('src/utils/pageWrappers/return404If').default
//     const AchievementsPage = require('src/pages/achievements').default
//     const mockProps = getMockProps()
//     shallow(<AchievementsPage {...mockProps} />)
//     expect(return404If).toHaveBeenCalledWith(true)
//   })
//
//   it('passes false to return404If when we should show the achievements page', () => {
//     expect.assertions(1)
//     const { showMockAchievements } = require('src/utils/featureFlags')
//     showMockAchievements.mockReturnValue(true)
//     const return404If = require('src/utils/pageWrappers/return404If').default
//     const AchievementsPage = require('src/pages/achievements').default
//     const mockProps = getMockProps()
//     shallow(<AchievementsPage {...mockProps} />)
//     expect(return404If).toHaveBeenCalledWith(false)
//   })
// })

describe('achievements.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AchievementsPage = require('src/pages/achievements').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AchievementsPage {...mockProps} />).dive()
    }).not.toThrow()
  })

  it('contains multiple Achievement components', () => {
    expect.assertions(1)
    const AchievementsPage = require('src/pages/achievements').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AchievementsPage {...mockProps} />).dive()
    expect(wrapper.find(Achievement).length).toBeGreaterThan(2)
  })
})

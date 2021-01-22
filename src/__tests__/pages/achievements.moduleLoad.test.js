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
  const { showMockAchievements } = require('src/utils/featureFlags')
  showMockAchievements.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('achievements.js: HOC', () => {
  it('passes true to return404If when we should not show the achievements page', () => {
    expect.assertions(1)
    const { showMockAchievements } = require('src/utils/featureFlags')
    showMockAchievements.mockReturnValue(false)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const AchievementsPage = require('src/pages/achievements').default
    const mockProps = getMockProps()
    shallow(<AchievementsPage {...mockProps} />)
    expect(return404If).toHaveBeenCalledWith(true)
  })

  it('passes false to return404If when we should show the achievements page', () => {
    expect.assertions(1)
    const { showMockAchievements } = require('src/utils/featureFlags')
    showMockAchievements.mockReturnValue(true)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const AchievementsPage = require('src/pages/achievements').default
    const mockProps = getMockProps()
    shallow(<AchievementsPage {...mockProps} />)
    expect(return404If).toHaveBeenCalledWith(false)
  })
})

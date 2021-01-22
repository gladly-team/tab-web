import React from 'react'
import { shallow } from 'enzyme'
import Achievement from 'src/components/Achievement'

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
})

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

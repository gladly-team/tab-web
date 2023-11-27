import React from 'react'
import { mount, shallow } from 'enzyme'
import GroupImpactContributionRow from '../GroupImpactContributionRow'

const getMockProps = () => ({
  groupImpactHistory: [
    {
      dollarContribution: 18700,
      tabDollarContribution: 1000,
      searchDollarContribution: 4000,
      shopDollarContribution: 5000,
      referralDollarContribution: 8700,
      dateStarted: '2017-07-17T20:45:53Z',
    },
    {
      dollarContribution: 19700,
      tabDollarContribution: 2000,
      searchDollarContribution: 4000,
      shopDollarContribution: 5000,
      referralDollarContribution: 8700,
      dateStarted: '2017-07-24T20:45:53Z',
    },
  ],
})

beforeEach(() => {
  process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB = 0.00001
})

describe('GroupImpactContribution component', () => {
  it('renders without error', () => {
    const GroupImpactContributionWidget =
      require('src/components/groupImpactComponents/GroupImpactContributionWidget').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpactContributionWidget {...mockProps} />)
    }).not.toThrow()
  })

  it('displays a GroupImpactContributionRow for each leaderboard entry', () => {
    const GroupImpactContributionWidget =
      require('src/components/groupImpactComponents/GroupImpactContributionWidget').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupImpactContributionWidget {...mockProps} />)
    const rows = wrapper.find(GroupImpactContributionRow)

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows.at(i)
      const leaderboardEntry = mockProps.groupImpactHistory[i]
      expect(row.prop('userGroupImpactMetricLog')).toEqual(leaderboardEntry)
    }
  })
})

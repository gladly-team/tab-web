import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import GroupImpactLeaderboardRow from '../GroupImpactLeaderboardRow'

const getMockProps = () => ({
  userId: 'cdef',
  leaderboardEntries: [
    {
      position: 1,
      user: {
        id: 'abcd',
        username: 'cat_lover',
      },
      userGroupImpactMetric: {
        dollarContribution: 10000,
        tabDollarContribution: 1000,
        searchDollarContribution: 4000,
        shopDollarContribution: 5000,
      },
    },
    {
      position: 2,
      user: {
        id: 'bcde',
        username: 'tree_lover',
      },
      userGroupImpactMetric: {
        dollarContribution: 9000,
        tabDollarContribution: 1000,
        searchDollarContribution: 4000,
        shopDollarContribution: 4000,
      },
    },
    {
      position: 150,
      user: {
        id: 'cdef',
        username: 'its_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6120,
        tabDollarContribution: 120,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
    {
      position: 151,
      user: {
        id: 'defg',
        username: 'its_not_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6000,
        tabDollarContribution: 0,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
  ],
  onClose: jest.fn(),
})

beforeEach(() => {
  process.env.EST_MONEY_RAISED_PER_TAB = 0.00001
})

describe('GroupImpactLeaderboard component', () => {
  it('renders without error', () => {
    const GroupImpactLeaderboard =
      require('src/components/groupImpactComponents/GroupImpactLeaderboard').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpactLeaderboard {...mockProps} />)
    }).not.toThrow()
  })

  it('displays a GroupImpactLeaderboardRow for each leaderboard entry', () => {
    const GroupImpactLeaderboard =
      require('src/components/groupImpactComponents/GroupImpactLeaderboard').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupImpactLeaderboard {...mockProps} />)
    const rows = wrapper.find(GroupImpactLeaderboardRow)

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows.at(i)
      const leaderboardEntry = mockProps.leaderboardEntries[i]
      expect(row.prop('position')).toEqual(leaderboardEntry.position)
      expect(row.prop('username')).toEqual(leaderboardEntry.user.username)
      expect(row.prop('userGroupImpactMetric')).toEqual(
        leaderboardEntry.userGroupImpactMetric
      )
      expect(row.prop('selected')).toEqual(
        mockProps.userId === leaderboardEntry.user.id
      )
    }
  })

  it('displays an ellipses if there is a gap in positions', () => {
    const GroupImpactLeaderboard =
      require('src/components/groupImpactComponents/GroupImpactLeaderboard').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactLeaderboard {...mockProps} />)
    const typographies = wrapper.find(Typography)

    expect(typographies.at(5).text()).toEqual('...')
  })

  it('displays no ellipses if there is a gap in positions', () => {
    const GroupImpactLeaderboard =
      require('src/components/groupImpactComponents/GroupImpactLeaderboard').default
    const mockProps = {
      ...getMockProps(),
      leaderboardEntries: [
        {
          position: 1,
          user: {
            id: 'abcd',
            username: 'cat_lover',
          },
          userGroupImpactMetric: {
            dollarContribution: 10000,
            tabDollarContribution: 1000,
            searchDollarContribution: 4000,
            shopDollarContribution: 5000,
          },
        },
        {
          position: 2,
          user: {
            id: 'bcde',
            username: 'tree_lover',
          },
          userGroupImpactMetric: {
            dollarContribution: 9000,
            tabDollarContribution: 1000,
            searchDollarContribution: 4000,
            shopDollarContribution: 4000,
          },
        },
        {
          position: 3,
          user: {
            id: 'cdef',
            username: 'its_me',
          },
          userGroupImpactMetric: {
            dollarContribution: 6120,
            tabDollarContribution: 120,
            searchDollarContribution: 3000,
            shopDollarContribution: 3000,
          },
        },
      ],
    }
    const wrapper = shallow(<GroupImpactLeaderboard {...mockProps} />)
    const typographies = wrapper.find(Typography)

    expect(typographies.length).toEqual(5)
  })

  it('calls onClose handler when clicked', () => {
    const GroupImpactLeaderboard =
      require('src/components/groupImpactComponents/GroupImpactLeaderboard').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactLeaderboard {...mockProps} />)
    wrapper.find(Button).first().simulate('click')

    expect(mockProps.onClose).toHaveBeenCalled()
  })
})

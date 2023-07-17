import React from 'react'
import { mount, shallow } from 'enzyme'
import { Typography } from '@material-ui/core'
import TabIcon from '@material-ui/icons/Tab'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

const getMockProps = () => ({
  position: 13567,
  username: 'cat_lover',
  userGroupImpactMetric: {
    dollarContribution: 12345,
    tabDollarContribution: 11111,
    searchDollarContribution: 1111,
    shopDollarContribution: 123,
  },
})

beforeEach(() => {
  process.env.NEXT_EST_MONEY_RAISED_PER_TAB = 0.00001
})

describe('GroupImpactLeaderboardRow component', () => {
  it('renders without error', () => {
    const GroupImpactLeaderboardRow =
      require('src/components/groupImpactComponents/GroupImpactLeaderboardRow').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpactLeaderboardRow {...mockProps} />)
    }).not.toThrow()
  })

  it('displays username, impact points and position and all icons', () => {
    const GroupImpactLeaderboardRow =
      require('src/components/groupImpactComponents/GroupImpactLeaderboardRow').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupImpactLeaderboardRow {...mockProps} />)
    const typographies = wrapper.find(Typography)

    expect(typographies.first().text()).toEqual(mockProps.position.toString())
    expect(typographies.at(1).text()).toEqual(mockProps.username)
    expect(typographies.at(2).text()).toEqual('1,235')

    expect(wrapper.find(TabIcon).length).toEqual(1)
    expect(wrapper.find(SearchIcon).length).toEqual(1)
    expect(wrapper.find(ShoppingCartIcon).length).toEqual(1)
  })

  it('does not display icons if value is 0 or null', () => {
    const GroupImpactLeaderboardRow =
      require('src/components/groupImpactComponents/GroupImpactLeaderboardRow').default
    const mockProps = {
      ...getMockProps(),
      userGroupImpactMetric: {
        dollarContribution: 12345,
        tabDollarContribution: 12345,
        searchDollarContribution: 0,
      },
    }

    const wrapper = mount(<GroupImpactLeaderboardRow {...mockProps} />)

    expect(wrapper.find(TabIcon).length).toEqual(1)
    expect(wrapper.find(SearchIcon).length).toEqual(0)
    expect(wrapper.find(ShoppingCartIcon).length).toEqual(0)
  })
})

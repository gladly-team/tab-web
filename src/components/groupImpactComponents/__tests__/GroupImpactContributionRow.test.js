import React from 'react'
import { mount, shallow } from 'enzyme'
import { Typography } from '@material-ui/core'
import TabIcon from '@material-ui/icons/Tab'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import GroupAddIcon from '@material-ui/icons/GroupAdd'

const getMockProps = () => ({
  userGroupImpactMetricLog: {
    dollarContribution: 13345,
    tabDollarContribution: 11111,
    searchDollarContribution: 1111,
    shopDollarContribution: 123,
    referralDollarContribution: 1000,
    dateStarted: '2020-01-10T10:00:00.000Z',
  },
})

beforeEach(() => {
  process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB = 0.00001
})

describe('GroupImpactContributionRow component', () => {
  it('renders without error', () => {
    const GroupImpactContributionRow =
      require('src/components/groupImpactComponents/GroupImpactContributionRow').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpactContributionRow {...mockProps} />)
    }).not.toThrow()
  })

  it('displays username, impact points and position and all icons', () => {
    const GroupImpactContributionRow =
      require('src/components/groupImpactComponents/GroupImpactContributionRow').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupImpactContributionRow {...mockProps} />)
    const typographies = wrapper.find(Typography)

    expect(typographies.first().text()).toEqual('1/10/2020')
    expect(typographies.at(1).text()).toEqual('1,335')

    expect(wrapper.find(TabIcon).length).toEqual(1)
    expect(wrapper.find(SearchIcon).length).toEqual(1)
    expect(wrapper.find(ShoppingCartIcon).length).toEqual(1)
    expect(wrapper.find(GroupAddIcon).length).toEqual(1)
  })

  it('does not display icons if value is 0 or null', () => {
    const GroupImpactContributionRow =
      require('src/components/groupImpactComponents/GroupImpactContributionRow').default
    const mockProps = {
      userGroupImpactMetricLog: {
        dollarContribution: 12345,
        tabDollarContribution: 12345,
        searchDollarContribution: 0,
        dateStarted: '2020-01-10T10:00:00.000Z',
      },
    }

    const wrapper = mount(<GroupImpactContributionRow {...mockProps} />)

    expect(wrapper.find(TabIcon).length).toEqual(1)
    expect(wrapper.find(SearchIcon).length).toEqual(0)
    expect(wrapper.find(ShoppingCartIcon).length).toEqual(0)
    expect(wrapper.find(GroupAddIcon).length).toEqual(0)
  })
})

/* eslint-disable jest/no-commented-out-tests */

import React from 'react'
import { shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import VerticalLinearProgress from 'src/components/VerticalLinearProgress'
import Box from '@material-ui/core/Box'
import Slide from '@material-ui/core/Slide'
import gtag from 'ga-gtag'
import { SFAC_ACTIVITY_STATES } from 'src/utils/constants'
import { shopLandingURL } from 'src/utils/urls'
import { windowOpenTop } from 'src/utils/navigation'
import SearchIcon from '@material-ui/icons/Search'
import TabIcon from '@material-ui/icons/Tab'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import GroupImpactLeaderboard from '../GroupImpactLeaderboard'

jest.mock('ga-gtag')
jest.mock('src/utils/navigation')

const getMockProps = () => ({
  userId: 'user-id',
  groupImpactSidebarState: 'badge-text',
  groupImpactMetric: {
    dollarProgress: 250,
    dollarGoal: 600,
    impactMetric: {
      impactTitle: 'impact-title',
      whyValuableDescription: 'why-valuable-description',
    },
  },
  open: true,
  openHandler: jest.fn(),
  sfacActivityState: SFAC_ACTIVITY_STATES.ACTIVE,
})

beforeEach(() => {
  jest.useFakeTimers()
})

// Disabling until resolving memory/deploy issues.
// eslint-disable-next-line jest/no-disabled-tests
describe('GroupImpactSidebar component', () => {
  it('renders without error', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpactSidebar {...mockProps} />)
    }).not.toThrow()
  })

  it('displays badge text if provided', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find('span').first().text()).toEqual(
      mockProps.groupImpactSidebarState
    )
  })

  it('does not display badge text if not', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    delete mockProps.groupImpactSidebarState
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('displays impactTitle', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(1).text()).toEqual(
      mockProps.groupImpactMetric.impactMetric.impactTitle
    )
  })

  it('displays whyValuableDescription', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(5).text()).toEqual(
      mockProps.groupImpactMetric.impactMetric.whyValuableDescription
    )
  })

  it('displays progress', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(2).text()).toEqual(
      `${Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      )}%`
    )
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual([
      Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      ),
    ])
  })

  it('displays correct progress bar with search', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      groupImpactMetric: {
        dollarProgress: 250,
        dollarProgressFromSearch: 100,
        dollarProgressFromShop: 0,
        dollarGoal: 600,
        impactMetric: {
          impactTitle: 'impact-title',
          whyValuableDescription: 'why-valuable-description',
        },
      },
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(2).text()).toEqual(
      `${Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      )}%`
    )
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual([
      Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      ),
      Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgressFromSearch /
            mockProps.groupImpactMetric.dollarGoal)
      ),
      Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgressFromShop /
            mockProps.groupImpactMetric.dollarGoal)
      ),
    ])
    expect(wrapper.find(VerticalLinearProgress).first().prop('icons')).toEqual([
      <TabIcon />,
      <SearchIcon />,
      <ShoppingCartIcon />,
    ])
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('tooltips')
    ).toEqual([
      `25% of funds raised by tabs opened through Tab for a Cause`,
      `16% of funds raised by searches through Search for a Cause`,
      `0% of funds raised by shopping through Shop for a Cause`,
    ])
    expect(wrapper.find(VerticalLinearProgress).at(1).prop('progress')).toEqual(
      [
        Math.floor(
          100 *
            (mockProps.groupImpactMetric.dollarProgress /
              mockProps.groupImpactMetric.dollarGoal)
        ),
        Math.floor(
          100 *
            (mockProps.groupImpactMetric.dollarProgressFromSearch /
              mockProps.groupImpactMetric.dollarGoal)
        ),
        0,
      ]
    )
  })

  it('displays correct progress bar above 100% with search', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      groupImpactMetric: {
        dollarProgress: 650,
        dollarProgressFromSearch: 100,
        dollarProgressFromShop: 0,
        dollarGoal: 600,
        impactMetric: {
          impactTitle: 'impact-title',
          whyValuableDescription: 'why-valuable-description',
        },
      },
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(2).text()).toEqual('108%')
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual([100, 16, 0])
    expect(wrapper.find(VerticalLinearProgress).first().prop('icons')).toEqual([
      <TabIcon />,
      <SearchIcon />,
      <ShoppingCartIcon />,
    ])
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('tooltips')
    ).toEqual([
      `84% of funds raised by tabs opened through Tab for a Cause`,
      `16% of funds raised by searches through Search for a Cause`,
      `0% of funds raised by shopping through Shop for a Cause`,
    ])
    expect(wrapper.find(VerticalLinearProgress).at(1).prop('progress')).toEqual(
      [100, 16, 0]
    )
  })

  it('displays correct progress bar with search too small', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      groupImpactMetric: {
        dollarProgress: 20,
        dollarProgressFromSearch: 6,
        dollarProgressFromShop: 0,
        dollarGoal: 600,
        impactMetric: {
          impactTitle: 'impact-title',
          whyValuableDescription: 'why-valuable-description',
        },
      },
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(2).text()).toEqual(
      `${Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      )}%`
    )
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual([16, 8, 0])
    expect(wrapper.find(VerticalLinearProgress).first().prop('icons')).toEqual([
      <TabIcon />,
      <SearchIcon />,
      <ShoppingCartIcon />,
    ])
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('tooltips')
    ).toEqual([
      `2% of funds raised by tabs opened through Tab for a Cause`,
      `1% of funds raised by searches through Search for a Cause`,
      `0% of funds raised by shopping through Shop for a Cause`,
    ])
    expect(wrapper.find(VerticalLinearProgress).at(1).prop('progress')).toEqual(
      [3, 1, 0]
    )
  })

  it('toggles sidebar on clicks', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    const button = wrapper.find(Button).first()

    expect(wrapper.find(Slide).prop('in')).toEqual(true)

    button.simulate('click', {
      stopPropagation: () => {},
    })
    wrapper.update()

    expect(wrapper.find(Slide).prop('in')).toEqual(false)
    expect(gtag).toHaveBeenCalledWith('event', 'group_impact_sidebar', {
      interaction: 'close',
    })

    const box = wrapper.find(Box).first()
    box.first().simulate('click', {
      stopPropagation: () => {},
    })

    expect(wrapper.find(Slide).prop('in')).toEqual(true)
    expect(gtag).toHaveBeenCalledWith('event', 'group_impact_sidebar', {
      interaction: 'close',
    })
    expect(mockProps.openHandler).toHaveBeenCalledTimes(2)
  })

  it('expands closed sidebar on hover', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      open: false,
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(wrapper.find(VerticalLinearProgress).at(1).prop('width')).toEqual(16)

    wrapper.find(Box).at(1).simulate('mouseover')
    wrapper.update()

    expect(wrapper.find(VerticalLinearProgress).at(1).prop('width')).toEqual(24)
  })

  it('shows start next goal button if last groupImpactMetric defined with correct content, runs handler and switches content', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      nextGoalButtonClickHandler: jest.fn(),
      lastGroupImpactMetric: {
        dollarProgress: 5e6,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
        },
      },
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(wrapper.find(Typography).at(1).text()).toEqual(
      mockProps.lastGroupImpactMetric.impactMetric.impactTitle
    )

    expect(wrapper.find(Typography).at(5).text()).toEqual(
      mockProps.lastGroupImpactMetric.impactMetric.whyValuableDescription
    )

    expect(wrapper.find(Typography).at(2).text()).toEqual(
      `${Math.round(
        100 *
          (mockProps.lastGroupImpactMetric.dollarProgress /
            mockProps.lastGroupImpactMetric.dollarGoal)
      )}%`
    )
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual([
      Math.round(
        100 *
          (mockProps.lastGroupImpactMetric.dollarProgress /
            mockProps.lastGroupImpactMetric.dollarGoal)
      ),
    ])

    const button = wrapper.find(Button).at(2)
    button.first().simulate('click', {
      stopPropagation: () => {},
    })
    jest.runAllTimers()

    expect(wrapper.find(Typography).at(1).text()).toEqual(
      mockProps.groupImpactMetric.impactMetric.impactTitle
    )

    expect(wrapper.find(Typography).at(5).text()).toEqual(
      mockProps.groupImpactMetric.impactMetric.whyValuableDescription
    )

    expect(wrapper.find(Typography).at(2).text()).toEqual(
      `${Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      )}%`
    )
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual([
      Math.floor(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      ),
    ])

    expect(mockProps.nextGoalButtonClickHandler).toHaveBeenCalled()
  })

  it('displays upsell widget for shop', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(wrapper.find(Typography).at(7).text()).toEqual(
      `You could triple your impact by raising money each time you shop online. Try out our newest project: Shop for a Cause today!`
    )

    const sfacButton = wrapper.find(Button).last()
    sfacButton.simulate('click')

    expect(gtag).toHaveBeenCalledWith('event', 'group_impact_sidebar', {
      interaction: 'click_shop_upsell',
    })
    expect(windowOpenTop).toHaveBeenCalledWith(shopLandingURL)
  })

  it('does not display group impact metric count if not applicable', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(
      wrapper.find('[data-test-id="groupImpactMetricCount"]').length
    ).toEqual(0)
  })

  it('does display group impact metric count if applicable', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      groupImpactMetric: {
        dollarProgressFromSearch: 125,
        dollarProgressFromShop: 0,
        dollarProgress: 250,
        dollarGoal: 600,
        impactMetric: {
          impactTitle: '{{count}} impact-title {{multiple}}',
          whyValuableDescription: 'why-valuable-description',
          impactCountPerMetric: 5,
        },
      },
      groupImpactMetricCount: 5,
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    const impactMetricCount = wrapper
      .find('[data-test-id="groupImpactMetricCount"]')
      .find(Typography)
    expect(impactMetricCount.at(0).text()).toEqual(
      'Tabbers like you have helped 25 impact-title true.'
    )
  })

  it('does display correct group impact metric count if applicable', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      groupImpactMetric: {
        dollarProgressFromSearch: 125,
        dollarProgressFromShop: 0,
        dollarProgress: 250,
        dollarGoal: 600,
        impactMetric: {
          impactTitle: '{{count}} impact-title {{multiple}}',
          whyValuableDescription: 'why-valuable-description',
          impactCountPerMetric: 1,
        },
      },
      groupImpactMetricCount: 1,
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    const impactMetricCount = wrapper
      .find('[data-test-id="groupImpactMetricCount"]')
      .find(Typography)
    expect(impactMetricCount.at(0).text()).toEqual(
      'Tabbers like you have helped 1 impact-title false.'
    )
  })

  it('does not render a leaderboard if not applicable', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      groupImpactMetric: {
        dollarProgressFromSearch: 125,
        dollarProgressFromShop: 0,
        dollarProgress: 250,
        dollarGoal: 600,
        impactMetric: {
          impactTitle: '{{count}} impact-title {{multiple}}',
          whyValuableDescription: 'why-valuable-description',
          impactCountPerMetric: 1,
        },
      },
      groupImpactMetricCount: 1,
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(GroupImpactLeaderboard).exists()).toEqual(false)
  })

  it('renders a leaderboard if applicable', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      groupImpactMetric: {
        dollarProgressFromSearch: 125,
        dollarProgressFromShop: 0,
        dollarProgress: 250,
        dollarGoal: 600,
        impactMetric: {
          impactTitle: '{{count}} impact-title {{multiple}}',
          whyValuableDescription: 'why-valuable-description',
          impactCountPerMetric: 1,
        },
      },
      groupImpactMetricCount: 1,
      leaderboard: [
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
      ],
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    const leaderboard = wrapper.find(GroupImpactLeaderboard)
    expect(leaderboard.exists()).toEqual(true)
    expect(leaderboard.first().prop('leaderboardEntries')).toEqual(
      mockProps.leaderboard
    )
    expect(leaderboard.first().prop('userId')).toEqual(mockProps.userId)
  })

  /* it('does not show start next goal button if lastGroupImpactMetric is not defined', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(wrapper.find(Button).length).toEqual(2)
  })

  it('does not display upsell widget if not search user', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      sfacActivityState: SFAC_ACTIVITY_STATES.ACTIVE,
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(wrapper.find(Typography).length).toEqual(8)
  })

  it('displays upsell widget if not search user, and button works correctly', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      sfacActivityState: SFAC_ACTIVITY_STATES.INACTIVE,
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(wrapper.find(Typography).at(7).text()).toEqual(
      `You could triple your impact by raising money each time you search. Try out our newest project: Search for a Cause today!`
    )

    const sfacButton = wrapper.find(Button).last()
    sfacButton.simulate('click')

    expect(gtag).toHaveBeenCalledWith('event', 'group_impact_sidebar', {
      interaction: 'click_search_upsell',
    })
    expect(windowOpenTop).toHaveBeenCalledWith(searchLandingURL)
  }) */
})

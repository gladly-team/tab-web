import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import { GROUP_IMPACT_SIDEBAR_STATE } from 'src/utils/constants'
import gtag from 'ga-gtag'
import Notification from '../../Notification'

jest.mock('ga-gtag')

const getMockProps = () => ({
  mode: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
  open: true,
  onDetails: jest.fn(),
  onNextGoal: jest.fn(),
  onGoalStarted: jest.fn(),
  impactTitle: 'impact title {{count}}',
  impactCountPerMetric: 5,
})

describe('GroupGoalNotification component', () => {
  it('renders without error', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupGoalNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('passes mode prop to Notification', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    expect(wrapper.find(Notification).first().prop('open')).toEqual(true)
  })

  it('impact title displayed in Completed Notification correctly', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    expect(wrapper.find(Typography).first().text()).toEqual(
      `COMPLETED: impact title 5`
    )
  })

  it('impact title displayed in Started Notification correctly', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = {
      ...getMockProps(),
      mode: GROUP_IMPACT_SIDEBAR_STATE.NEW,
    }
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    expect(wrapper.find(Typography).first().text()).toEqual(
      `GOAL STARTED: impact title 5`
    )
  })

  it('displays correct buttons and calls correct handlers and tracking in completed mode', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    const detailsButton = wrapper.find(Button).at(0)
    expect(detailsButton.text()).toEqual('Details')
    detailsButton.simulate('click')
    expect(mockProps.onDetails).toHaveBeenCalled()
    expect(gtag).toHaveBeenCalledWith('event', 'group_impact_notification', {
      interaction: 'details',
      mode: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
    })

    const nextGoalButton = wrapper.find(Button).at(1)
    expect(nextGoalButton.text()).toEqual('Next Goal')

    nextGoalButton.simulate('click')
    expect(mockProps.onNextGoal).toHaveBeenCalled()
    expect(gtag).toHaveBeenCalledWith('event', 'group_impact_notification', {
      interaction: 'next_goal',
      mode: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
    })
  })

  it('displays correct button and calls correct handlers and tracking in started mode', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = {
      ...getMockProps(),
      mode: GROUP_IMPACT_SIDEBAR_STATE.NEW,
    }
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    const expandButton = wrapper.find(Button).at(0)

    expandButton.simulate('click')
    expect(mockProps.onGoalStarted).toHaveBeenCalled()
    expect(gtag).toHaveBeenCalledWith('event', 'group_impact_notification', {
      interaction: 'goal_started',
      mode: GROUP_IMPACT_SIDEBAR_STATE.NEW,
    })
  })
})

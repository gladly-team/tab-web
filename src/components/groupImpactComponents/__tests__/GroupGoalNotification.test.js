import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import Notification from '../../Notification'

const getMockProps = () => ({
  mode: 'completed',
  open: true,
  onDetails: jest.fn(),
  onNextGoal: jest.fn(),
  onGoalStarted: jest.fn(),
  impactTitle: 'impact title',
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
      `COMPLETED: ${mockProps.impactTitle}`
    )
  })

  it('impact title displayed in Started Notification correctly', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = {
      ...getMockProps(),
      mode: 'started',
    }
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    expect(wrapper.find(Typography).first().text()).toEqual(
      `GOAL STARTED: ${mockProps.impactTitle}`
    )
  })

  it('displays correct buttons and calls correct handlers in completed mode', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    const detailsButton = wrapper.find(Button).at(0)
    expect(detailsButton.text()).toEqual('Details')

    detailsButton.simulate('click')
    expect(mockProps.onDetails).toHaveBeenCalled()

    const nextGoalButton = wrapper.find(Button).at(1)
    expect(nextGoalButton.text()).toEqual('Next Goal')

    nextGoalButton.simulate('click')
    expect(mockProps.onNextGoal).toHaveBeenCalled()
  })

  it('displays correct button and calls correct handlers in started mode', () => {
    const GroupGoalNotification =
      require('src/components/groupImpactComponents/GroupGoalNotification').default
    const mockProps = {
      ...getMockProps(),
      mode: 'started',
    }
    const wrapper = mount(<GroupGoalNotification {...mockProps} />)
    const expandButton = wrapper.find(Button).at(0)

    expandButton.simulate('click')
    expect(mockProps.onGoalStarted).toHaveBeenCalled()
  })
})

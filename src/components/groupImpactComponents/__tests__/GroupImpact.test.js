import React from 'react'
import { mount, shallow } from 'enzyme'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localstorageManager from 'src/utils/localstorage-mgr'
import Celebration from 'src/components/Confetti'
import {
  GROUP_IMPACT_SIDEBAR_STATE,
  CURRENT_GROUP_IMPACT_VIEWS,
  COMPLETED_GROUP_IMPACT_VIEWS,
} from 'src/utils/constants'
import Button from '@material-ui/core/Button'
import Slide from '@material-ui/core/Slide'
import GroupImpactSidebar from '../GroupImpactSidebar'
import GroupGoalNotification from '../GroupGoalNotification'

jest.mock('src/utils/localstorage-mgr')
jest.mock('src/utils/localstorageGroupImpactManager')
jest.mock('src/components/Confetti', () => () => <div />)

const getMockProps = () => ({
  groupImpactMetric: {
    id: 'abcd',
    dollarProgress: 250,
    dollarGoal: 600,
    impactMetric: {
      impactTitle: 'impact-title',
      whyValuableDescription: 'why-valuable-description',
    },
  },
})

afterEach(() => {
  jest.resetAllMocks()
})

// Disabling until resolving memory/deploy issues.
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('GroupImpact component', () => {
  it('renders without error', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpact {...mockProps} />)
    }).not.toThrow()
  })

  it('renders celebration if there is a different last group impact metric and first view', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(0)
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      {
        id: 'bcde',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
        },
      }
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(wrapper.find(Celebration).length).toEqual(1)
  })

  it('does not render celebration if new goal views > 0', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(1)
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      {
        id: 'bcde',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
        },
      }
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(wrapper.find(Celebration).length).toEqual(0)
  })

  it('does not render celebration same group impact metric', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(0)
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      {
        id: 'abcd',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
        },
      }
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(wrapper.find(Celebration).length).toEqual(0)
  })

  it('renders in completed mode if goal is different, and not enough views', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(0)
    const lastGroupImpactMetric = {
      id: 'bcde',
      dollarProgress: 28e5,
      dollarGoal: 5e6,
      impactMetric: {
        impactTitle: 'Provide 1 home visit from a community health worker',
        whyValuableDescription:
          'Community health workers provide quality health care to those who might not otherwise have access.',
      },
    }
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      lastGroupImpactMetric
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('groupImpactSidebarState')
    ).toEqual('COMPLETED')
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('lastGroupImpactMetric')
    ).toEqual(lastGroupImpactMetric)
    expect(localstorageManager.setItem).toHaveBeenCalledWith(
      COMPLETED_GROUP_IMPACT_VIEWS,
      1
    )
  })

  it('renders switches to new mode if has viewed enough times while completed', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(3)
    const lastGroupImpactMetric = {
      id: 'bcde',
      dollarProgress: 28e5,
      dollarGoal: 5e6,
      impactMetric: {
        impactTitle: 'Provide 1 home visit from a community health worker',
        whyValuableDescription:
          'Community health workers provide quality health care to those who might not otherwise have access.',
      },
    }
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      lastGroupImpactMetric
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('groupImpactSidebarState')
    ).toEqual('NEW')
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('lastGroupImpactMetric')
    ).toEqual(mockProps.groupImpactMetric)
    expect(localstorageManager.setItem).toHaveBeenCalledWith(
      COMPLETED_GROUP_IMPACT_VIEWS,
      0
    )
    expect(localstorageManager.setItem).toHaveBeenCalledWith(
      CURRENT_GROUP_IMPACT_VIEWS,
      0
    )
    expect(
      localstorageGroupImpactManager.setLastSeenGroupImpactMetric
    ).toHaveBeenCalledWith(mockProps.groupImpactMetric)
  })

  it('is in new mode if has not viewed enough times while new', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(0)
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      mockProps.groupImpactMetric
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('groupImpactSidebarState')
    ).toEqual(GROUP_IMPACT_SIDEBAR_STATE.NEW)
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('lastGroupImpactMetric')
    ).toEqual(mockProps.groupImpactMetric)
    expect(localstorageManager.setItem).toHaveBeenCalledWith(
      CURRENT_GROUP_IMPACT_VIEWS,
      1
    )
  })

  it('is in normal mode if has been viewed enough times while new', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(4)
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      mockProps.groupImpactMetric
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('groupImpactSidebarState')
    ).toEqual(GROUP_IMPACT_SIDEBAR_STATE.NORMAL)
    expect(localstorageManager.setItem).not.toHaveBeenCalled()
  })

  it('displays group goal notification if new mode for component, with correct handler which toggles sidebar', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(0)
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      mockProps.groupImpactMetric
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(wrapper.find(GroupGoalNotification).first().prop('mode')).toEqual(
      GROUP_IMPACT_SIDEBAR_STATE.NEW
    )
    expect(wrapper.find(GroupImpactSidebar).prop('open')).toEqual(false)
    expect(wrapper.find(Slide).at(1).prop('in')).toEqual(true)

    const detailsButton = wrapper
      .find(GroupGoalNotification)
      .find(Button)
      .first()
    detailsButton.simulate('click')

    expect(wrapper.find(GroupImpactSidebar).prop('open')).toEqual(true)
    expect(wrapper.find(Slide).at(1).prop('in')).toEqual(false)
  })

  it('displays group goal notification if completed mode for component, with correct handler which toggles sidebar', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(0)
    const lastGroupImpactMetric = {
      id: 'bcde',
      dollarProgress: 28e5,
      dollarGoal: 5e6,
      impactMetric: {
        impactTitle: 'Provide 1 home visit from a community health worker',
        whyValuableDescription:
          'Community health workers provide quality health care to those who might not otherwise have access.',
      },
    }
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      lastGroupImpactMetric
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(wrapper.find(GroupGoalNotification).first().prop('mode')).toEqual(
      GROUP_IMPACT_SIDEBAR_STATE.COMPLETED
    )

    expect(wrapper.find(GroupImpactSidebar).prop('open')).toEqual(false)
    expect(wrapper.find(Slide).at(1).prop('in')).toEqual(true)

    const detailsButton = wrapper
      .find(GroupGoalNotification)
      .find(Button)
      .first()
    detailsButton.simulate('click')

    expect(wrapper.find(GroupImpactSidebar).prop('open')).toEqual(true)
    expect(wrapper.find(Slide).at(1).prop('in')).toEqual(false)
  })

  it('displays group goal notification if completed mode for component, with correct handler which completes new', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(0)
    const lastGroupImpactMetric = {
      id: 'bcde',
      dollarProgress: 28e5,
      dollarGoal: 5e6,
      impactMetric: {
        impactTitle: 'Provide 1 home visit from a community health worker',
        whyValuableDescription:
          'Community health workers provide quality health care to those who might not otherwise have access.',
      },
    }
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      lastGroupImpactMetric
    )

    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(wrapper.find(GroupGoalNotification).first().prop('mode')).toEqual(
      GROUP_IMPACT_SIDEBAR_STATE.COMPLETED
    )

    expect(wrapper.find(GroupImpactSidebar).prop('open')).toEqual(false)
    expect(wrapper.find(Slide).at(1).prop('in')).toEqual(true)

    const detailsButton = wrapper.find(GroupGoalNotification).find(Button).at(1)
    detailsButton.simulate('click')

    expect(
      wrapper.find(GroupImpactSidebar).first().prop('groupImpactSidebarState')
    ).toEqual('NEW')
    expect(
      wrapper.find(GroupImpactSidebar).first().prop('lastGroupImpactMetric')
    ).toEqual(mockProps.groupImpactMetric)
    expect(localstorageManager.setItem).toHaveBeenCalledWith(
      COMPLETED_GROUP_IMPACT_VIEWS,
      0
    )
    expect(localstorageManager.setItem).toHaveBeenCalledWith(
      CURRENT_GROUP_IMPACT_VIEWS,
      0
    )
    expect(
      localstorageGroupImpactManager.setLastSeenGroupImpactMetric
    ).toHaveBeenCalledWith(mockProps.groupImpactMetric)

    expect(wrapper.find(GroupImpactSidebar).prop('open')).toEqual(false)
    expect(wrapper.find(Slide).at(1).prop('in')).toEqual(true)
    expect(wrapper.find(GroupGoalNotification).first().prop('mode')).toEqual(
      GROUP_IMPACT_SIDEBAR_STATE.NEW
    )
  })

  it('does not display group goal notification if not normal mode for component, with correct handler which toggles sidebar', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getNumericItem.mockReturnValue(5)
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric.mockReturnValue(
      mockProps.groupImpactMetric
    )
    const wrapper = mount(<GroupImpact {...mockProps} />)
    expect(wrapper.find(GroupGoalNotification).exists()).toEqual(false)
  })
})

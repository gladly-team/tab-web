import React from 'react'
import { shallow } from 'enzyme'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localstorageManager from 'src/utils/localstorage-mgr'
import Celebration from 'src/components/Confetti'

jest.mock('src/utils/localstorage-mgr')
jest.mock('src/utils/localstorageGroupImpactManager')

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

describe('GroupImpact component', () => {
  it('renders without error', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<GroupImpact {...mockProps} />)
    }).not.toThrow()
  })

  it('renders celebration if there is a different last group impact metric and viewed once', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getItem.mockReturnValue('0')
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
    const wrapper = shallow(<GroupImpact {...mockProps} />)
    expect(wrapper.find(Celebration).length).toEqual(1)
  })

  it('does not render celebration if new goal views > 0', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getItem.mockReturnValue('1')
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
    const wrapper = shallow(<GroupImpact {...mockProps} />)
    expect(wrapper.find(Celebration).length).toEqual(0)
  })

  it('does not render celebration same group impact metric', () => {
    const GroupImpact =
      require('src/components/groupImpactComponents/GroupImpact').default
    const mockProps = getMockProps()
    localstorageManager.getItem.mockReturnValue('0')
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
    const wrapper = shallow(<GroupImpact {...mockProps} />)
    expect(wrapper.find(Celebration).length).toEqual(0)
  })
})

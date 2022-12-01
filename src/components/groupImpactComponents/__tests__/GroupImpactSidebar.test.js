import React from 'react'
import { shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import VerticalLinearProgress from 'src/components/VerticalLinearProgress'
import Box from '@material-ui/core/Box'

const getMockProps = () => ({
  badgeText: 'badge-text',
  impactMetric: {
    impactTitle: 'impact-title',
    whyValuableDescription: 'why-valuable-description',
  },
  groupImpactMetric: {
    dollarProgress: 250,
    dollarGoal: 600,
  },
  participants: 1234,
})

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
    expect(wrapper.find('span').first().text()).toEqual(mockProps.badgeText)
  })

  it('does not display badge text if not', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    delete mockProps.badgeText
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find('span').exists()).toBe(false)
  })

  it('displays impactTitle', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(1).text()).toEqual(
      mockProps.impactMetric.impactTitle
    )
  })

  it('displays whyValuableDescription', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(7).text()).toEqual(
      mockProps.impactMetric.whyValuableDescription
    )
  })

  it('displays progress', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(2).text()).toEqual(
      `${Math.round(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      )}%`
    )
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual(
      Math.round(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      )
    )
  })

  it('toggles sidebar on clicks', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    const button = wrapper.find(Button).first()

    expect(wrapper.find(Box).exists()).toEqual(false)

    button.simulate('click')
    wrapper.update()

    const box = wrapper.find(Box)
    expect(box.exists()).toEqual(true)
    expect(
      wrapper.find(VerticalLinearProgress).first().prop('progress')
    ).toEqual(
      Math.round(
        100 *
          (mockProps.groupImpactMetric.dollarProgress /
            mockProps.groupImpactMetric.dollarGoal)
      )
    )

    box.first().simulate('click')
    expect(wrapper.find(Box).exists()).toEqual(false)
  })

  it('displays participants', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = getMockProps()
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)
    expect(wrapper.find(Typography).at(4).text()).toEqual(
      `${mockProps.participants}`
    )
  })
})

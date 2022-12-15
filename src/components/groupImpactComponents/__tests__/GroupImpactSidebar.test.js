import React from 'react'
import { shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import VerticalLinearProgress from 'src/components/VerticalLinearProgress'
import Box from '@material-ui/core/Box'
import Slide from '@material-ui/core/Slide'
import Fade from '@material-ui/core/Fade'

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
  open: true,
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
    expect(wrapper.find(Typography).at(5).text()).toEqual(
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

    expect(wrapper.find(Slide).prop('in')).toEqual(true)

    button.simulate('click', {
      stopPropagation: () => {},
    })
    wrapper.update()

    expect(wrapper.find(Slide).prop('in')).toEqual(false)

    const box = wrapper.find(Box).first()
    box.first().simulate('click', {
      stopPropagation: () => {},
    })

    expect(wrapper.find(Slide).prop('in')).toEqual(true)
  })

  it('expands closed sidebar on hover', () => {
    const GroupImpactSidebar =
      require('src/components/groupImpactComponents/GroupImpactSidebar').default
    const mockProps = {
      ...getMockProps(),
      open: false,
    }
    const wrapper = shallow(<GroupImpactSidebar {...mockProps} />)

    expect(wrapper.find(VerticalLinearProgress).at(1).prop('width')).toEqual(8)
    expect(wrapper.find(Fade).prop('in')).toEqual(false)

    wrapper.find(Box).at(1).simulate('mouseover')
    wrapper.update()

    expect(wrapper.find(Fade).prop('in')).toEqual(true)

    expect(wrapper.find(VerticalLinearProgress).at(1).prop('width')).toEqual(24)
  })
})

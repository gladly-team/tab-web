import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import DashboardPopover from 'src/components/DashboardPopover'
import Button from '@material-ui/core/Button'

const getMockProps = () => ({
  progress: 50,
})

describe('SquadCounter component', () => {
  it('renders without error', () => {
    const SquadCounter = require('src/components/SquadCounter').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SquadCounter {...mockProps} />)
    }).not.toThrow()
  })

  it('displays the progress on LinearProgress', () => {
    const SquadCounter = require('src/components/SquadCounter').default
    const mockProps = {
      ...getMockProps(),
      progress: 10,
    }
    const wrapper = shallow(<SquadCounter {...mockProps} />)
    expect(wrapper.find(LinearProgress).first().prop('value')).toEqual(10)
    expect(wrapper.find(LinearProgress).first().prop('variant')).toEqual(
      'determinate'
    )
  })

  it('displays the popup when clicked on', () => {
    const SquadCounter = require('src/components/SquadCounter').default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<SquadCounter {...defaultMockProps} />)
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)

    wrapper.find(Button).first().simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
  })

  it('popover onClose sets isPopoverOpen to false', () => {
    const SquadCounter = require('src/components/SquadCounter').default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<SquadCounter {...defaultMockProps} />)
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)

    wrapper.find(Button).simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)

    wrapper.find(DashboardPopover).prop('onClose')()
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
  })
})

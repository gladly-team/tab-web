import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import DashboardPopover from 'src/components/DashboardPopover'
import Button from '@material-ui/core/Button'
import Markdown from 'src/components/Markdown'

const getMockProps = () => ({
  includeNumber: false,
  number: 0,
  progress: 10,
})

describe('ImpactCounter component', () => {
  it('renders without error', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ImpactCounter {...mockProps} />)
    }).not.toThrow()
  })

  it('hides the number on includeNumber false', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const wrapper = shallow(<ImpactCounter {...getMockProps()} />)
    expect(
      wrapper
        .find(Typography)
        .filterWhere((elem) => elem.prop('variant') === 'h3').length
    ).toEqual(0)
  })

  it('displays the number on includeNumber true', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const mockProps = {
      ...getMockProps(),
      includeNumber: true,
      number: 10,
    }
    const wrapper = shallow(<ImpactCounter {...mockProps} />)
    expect(wrapper.find(Typography).exists()).toEqual(true)
    expect(wrapper.find(Typography).first().text()).toEqual('10')
  })

  it('displays the progress on CircularProgress', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const mockProps = {
      ...getMockProps(),
      progress: 10,
    }
    const wrapper = shallow(<ImpactCounter {...mockProps} />)
    expect(wrapper.find(CircularProgress).first().prop('value')).toEqual(10)
    expect(wrapper.find(CircularProgress).first().prop('variant')).toEqual(
      'determinate'
    )
  })

  it('displays the progress to never be empty on CircularProgress', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const mockProps = {
      ...getMockProps(),
      progress: 0,
    }
    const wrapper = shallow(<ImpactCounter {...mockProps} />)
    expect(wrapper.find(CircularProgress).first().prop('value')).toEqual(1)
    expect(wrapper.find(CircularProgress).first().prop('variant')).toEqual(
      'determinate'
    )
  })

  it('disables the button when disabled prop is passed in', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const mockProps = {
      ...getMockProps(),
      progress: 0,
      disabled: true,
    }
    const wrapper = shallow(<ImpactCounter {...mockProps} />)
    expect(wrapper.find(Button).prop('disabled')).toEqual(true)
  })

  it('displays the popup when clicked on', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<ImpactCounter {...defaultMockProps} />)
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)

    wrapper.find(Button).first().simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
  })

  it('popover onClose sets isPopoverOpen to false', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<ImpactCounter {...defaultMockProps} />)
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)

    wrapper.find(Button).simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)

    wrapper.find(DashboardPopover).prop('onClose')()
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
  })

  it('shows standard text in the popover when the ImpactCounter is not disabled', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const expectedStandardText =
      '##### **Your pawsitive impact!**\n\nThis shows how many treats your tabs can provide to help shelter cats get adopted. Every tab you open helps. Keep it up!'
    const defaultMockProps = getMockProps()
    const wrapper = shallow(<ImpactCounter {...defaultMockProps} />)
    expect(
      wrapper.find(DashboardPopover).find(Markdown).prop('children')
    ).toEqual(expectedStandardText)
  })

  it('shows mission text in the popover when the ImpactCounter is disabled', () => {
    const ImpactCounter = require('src/components/ImpactCounter').default
    const expectedStandardText =
      '##### **Your treats are still here**\n\nDon’t worry, we’ve still got your treats! We just paused them while you and your squad complete your new mission.'
    const defaultMockProps = {
      ...getMockProps(),
      disabled: true,
    }
    const wrapper = shallow(<ImpactCounter {...defaultMockProps} />)
    expect(
      wrapper.find(DashboardPopover).find(Markdown).prop('children')
    ).toEqual(expectedStandardText)
  })
})

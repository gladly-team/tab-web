import React from 'react'
import { shallow } from 'enzyme'
import Popover from '@material-ui/core/Popover'

const getMockProps = () => ({
  anchorEl: <div>Hello</div>,
  open: false,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('DashboardPopover', () => {
  it('renders without error', () => {
    const DashboardPopover = require('src/components/DashboardPopover').default
    const mockProps = getMockProps()
    expect(() => shallow(<DashboardPopover {...mockProps} />)).not.toThrow()
  })

  it('passes the "open" prop to Popover', () => {
    const DashboardPopover = require('src/components/DashboardPopover').default
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardPopover {...mockProps} />)
    wrapper.setProps({ open: true })
    expect(wrapper.find(Popover).prop('open')).toBe(true)
    wrapper.setProps({ open: false })
    expect(wrapper.find(Popover).prop('open')).toBe(false)
  })

  it('passes the "anchorElement" prop to Popover', () => {
    const DashboardPopover = require('src/components/DashboardPopover').default
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardPopover {...mockProps} />)
    const mockAnchorEl = <div id="blah" />
    wrapper.setProps({ anchorEl: mockAnchorEl })
    expect(wrapper.find(Popover).prop('anchorEl')).toBe(mockAnchorEl)
  })

  it('passes the "onClose" prop to Popover', () => {
    const DashboardPopover = require('src/components/DashboardPopover').default
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardPopover {...mockProps} />)
    const onClose = () => {
      'blah'
    }
    wrapper.setProps({ onClose })
    expect(wrapper.find(Popover).prop('onClose')).toBe(onClose)
  })

  it('passes the "popoverClasses" prop to Popover', () => {
    const DashboardPopover = require('src/components/DashboardPopover').default
    const mockProps = getMockProps()
    const wrapper = shallow(<DashboardPopover {...mockProps} />)
    const popoverClasses = {
      test: 'blah',
    }
    wrapper.setProps({ popoverClasses })
    expect(wrapper.find(Popover).prop('classes')).toBe(popoverClasses)
  })
})

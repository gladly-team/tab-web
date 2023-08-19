import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import DashboardPopover from 'src/components/DashboardPopover'
import BadgeButton from 'src/components/BadgeButton'
import ShacActivityNotification from 'src/components/ShacActivityNotification'

const getMockProps = () => ({
  user: {
    cause: {
      name: 'Trees',
    },
    shacTotalEarned: 150.25,
    shacActivityState: 'active',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('ShacActivity', () => {
  it('renders without error', () => {
    const ShacActivity = require('src/components/ShacActivity').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<ShacActivity {...mockProps} />)
    }).not.toThrow()
  })

  it('passes the expected props to BadgeButton', () => {
    const ShacActivity = require('src/components/ShacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShacActivity {...mockProps} />)
    const shacActivityButton = wrapper.find(BadgeButton)
    expect(shacActivityButton.props()).toEqual({
      active: true,
      onClick: expect.any(Function),
      icon: expect.anything(),
    })
  })

  it('passes active=true to BadgeButton when shacActivityState is "active"', () => {
    const ShacActivity = require('src/components/ShacActivity').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        shacActivityState: 'active',
      },
    }
    const wrapper = mount(<ShacActivity {...mockProps} />)
    const shacActivityButton = wrapper.find(BadgeButton)
    expect(shacActivityButton.prop('active')).toBe(true)
  })

  it('passes active=false to BadgeButton when shacActivityState is "inactive"', () => {
    const ShacActivity = require('src/components/ShacActivity').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        shacActivityState: 'inactive',
      },
    }
    const wrapper = mount(<ShacActivity {...mockProps} />)
    const shacActivityButton = wrapper.find(BadgeButton)
    expect(shacActivityButton.prop('active')).toBe(false)
  })

  it('passes active=false to BadgeButton when shacActivityState is "new"', () => {
    const ShacActivity = require('src/components/ShacActivity').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        shacActivityState: 'new',
      },
    }
    const wrapper = mount(<ShacActivity {...mockProps} />)
    const shacActivityButton = wrapper.find(BadgeButton)
    expect(shacActivityButton.prop('active')).toBe(false)
  })

  it('opens the popover when clicking the button and closes onClose', () => {
    expect.assertions(3)
    const ShacActivity = require('src/components/ShacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShacActivity {...mockProps} />)
    const button = wrapper.find(BadgeButton).find('button')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    button.simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
    act(() => {
      wrapper.find(DashboardPopover).prop('onClose')()
    })
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
  })

  it('passes the expected props to ShacActivityNotification', () => {
    const ShacActivity = require('src/components/ShacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShacActivity {...mockProps} />)

    // Open the popover
    wrapper.find(BadgeButton).find('button').simulate('click')
    const notif = wrapper.find(ShacActivityNotification)
    expect(notif.props()).toEqual({
      className: expect.any(String),
      activityState: 'active',
      totalEarned: 150.25,
      impactName: 'Trees',
    })
  })
})

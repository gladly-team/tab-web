import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import DashboardPopover from 'src/components/DashboardPopover'
import BadgeButton from 'src/components/BadgeButton'
import SfacActivityNotification from 'src/components/SfacActivityNotification'

const getMockProps = () => ({
  user: {
    cause: {
      name: 'Trees',
    },
    searches: 43,
    searchesToday: 6,
    sfacActivityState: 'active',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SfacActivity', () => {
  it('renders without error', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<SfacActivity {...mockProps} />)
    }).not.toThrow()
  })

  it('passes the expected props to BadgeButton', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivity {...mockProps} />)
    const sfacActivityButton = wrapper.find(BadgeButton)
    expect(sfacActivityButton.props()).toEqual({
      active: true,
      onClick: expect.any(Function),
      icon: expect.anything(),
    })
  })

  it('passes active=true to BadgeButton when sfacActivityState is "active"', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        sfacActivityState: 'active',
      },
    }
    const wrapper = mount(<SfacActivity {...mockProps} />)
    const sfacActivityButton = wrapper.find(BadgeButton)
    expect(sfacActivityButton.prop('active')).toBe(true)
  })

  it('passes active=false to BadgeButton when sfacActivityState is "inactive"', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        sfacActivityState: 'inactive',
      },
    }
    const wrapper = mount(<SfacActivity {...mockProps} />)
    const sfacActivityButton = wrapper.find(BadgeButton)
    expect(sfacActivityButton.prop('active')).toBe(false)
  })

  it('passes active=false to BadgeButton when sfacActivityState is "new"', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      user: {
        ...defaultMockProps.user,
        sfacActivityState: 'new',
      },
    }
    const wrapper = mount(<SfacActivity {...mockProps} />)
    const sfacActivityButton = wrapper.find(BadgeButton)
    expect(sfacActivityButton.prop('active')).toBe(false)
  })

  it('opens the popover when clicking the button and closes onClose', () => {
    expect.assertions(3)
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivity {...mockProps} />)
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

  it('passes the expected props to SfacActivityNotification', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivity {...mockProps} />)

    // Open the popover
    wrapper.find(BadgeButton).find('button').simulate('click')
    const notif = wrapper.find(SfacActivityNotification)
    expect(notif.props()).toEqual({
      className: expect.any(String),
      activityState: 'active',
      searchesToday: 6,
      totalSearches: 43,
      impactName: 'Trees',
    })
  })
})

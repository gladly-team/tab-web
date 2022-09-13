import React from 'react'
import { mount } from 'enzyme'
import DashboardPopover from 'src/components/DashboardPopover'
import SfacActivityButton from 'src/components/SfacActivityButton'
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

  it('passes the expected props to SfacActivityButton', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivity {...mockProps} />)
    const sfacActivityButton = wrapper.find(SfacActivityButton)
    expect(sfacActivityButton.props()).toEqual({
      active: true,
      onClick: expect.any(Function),
    })
  })

  it('passes active=true to SfacActivityButton when sfacActivityState is "active"', () => {
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
    const sfacActivityButton = wrapper.find(SfacActivityButton)
    expect(sfacActivityButton.prop('active')).toBe(true)
  })

  it('passes active=false to SfacActivityButton when sfacActivityState is "inactive"', () => {
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
    const sfacActivityButton = wrapper.find(SfacActivityButton)
    expect(sfacActivityButton.prop('active')).toBe(false)
  })

  it('passes active=false to SfacActivityButton when sfacActivityState is "new"', () => {
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
    const sfacActivityButton = wrapper.find(SfacActivityButton)
    expect(sfacActivityButton.prop('active')).toBe(false)
  })

  it('opens the popover when clicking the button and closes onClose', () => {
    expect.assertions(2)
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivity {...mockProps} />)
    const button = wrapper.find(SfacActivityButton).find('button')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
    button.simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
  })

  it('passes the expected props to SfacActivityNotification', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivity {...mockProps} />)

    // Open the popover
    wrapper.find(SfacActivityButton).find('button').simulate('click')
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

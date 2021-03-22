import React from 'react'
import { mount, shallow } from 'enzyme'
import DashboardPopover from 'src/components/DashboardPopover'
import IconButton from '@material-ui/core/IconButton'

const getMockProps = () => ({
  user: {
    username: 'someUsername',
    numUsersRecruited: 99999,
  },
})

describe('InviteFriendsIcon component', () => {
  it('renders without error', () => {
    const InviteFriendsIcon = require('src/components/InviteFriendsIcon')
      .default
    const mockProps = getMockProps()
    expect(() => {
      mount(<InviteFriendsIcon {...mockProps} />)
    }).not.toThrow()
  })

  it('displays the popup when clicked on', () => {
    const InviteFriendsIcon = require('src/components/InviteFriendsIcon')
      .default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<InviteFriendsIcon {...defaultMockProps} />)
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)

    wrapper.find(IconButton).first().simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)
  })

  it('popover onClose sets isPopoverOpen to false', () => {
    const InviteFriendsIcon = require('src/components/InviteFriendsIcon')
      .default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<InviteFriendsIcon {...defaultMockProps} />)
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)

    wrapper.find(IconButton).simulate('click')
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(true)

    wrapper.find(DashboardPopover).prop('onClose')()
    wrapper.update()
    expect(wrapper.find(DashboardPopover).prop('open')).toBe(false)
  })

  it('displays the number of users recruited', () => {
    const InviteFriendsIcon = require('src/components/InviteFriendsIcon')
      .default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<InviteFriendsIcon {...defaultMockProps} />)
    wrapper.find(DashboardPopover).simulate('click')
    expect(wrapper.find('span').first().text()).toEqual('99999 friends ')
  })
})

import React from 'react'
import { mount, shallow } from 'enzyme'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'

const getMockProps = () => ({
  user: {
    username: 'someUsername',
    numUsersRecruited: 99999,
    id: 'someUserId',
  },
})

describe('InviteFriendsIcon component', () => {
  it('renders without error', () => {
    const InviteFriendsIcon =
      require('src/components/InviteFriendsIcon').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<InviteFriendsIcon {...mockProps} />)
    }).not.toThrow()
  })

  it('displays the dialog when clicked on', () => {
    const InviteFriendsIcon =
      require('src/components/InviteFriendsIcon').default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<InviteFriendsIcon {...defaultMockProps} />)
    expect(wrapper.find(Dialog).prop('open')).toBe(false)

    wrapper.find(IconButton).first().simulate('click')
    expect(wrapper.find(Dialog).prop('open')).toBe(true)
  })

  it('popover onClose sets isPopoverOpen to false', () => {
    const InviteFriendsIcon =
      require('src/components/InviteFriendsIcon').default
    const defaultMockProps = getMockProps()

    const wrapper = shallow(<InviteFriendsIcon {...defaultMockProps} />)
    expect(wrapper.find(Dialog).prop('open')).toBe(false)

    wrapper.find(IconButton).simulate('click')
    expect(wrapper.find(Dialog).prop('open')).toBe(true)

    wrapper.find(Dialog).prop('onClose')()
    wrapper.update()
    expect(wrapper.find(Dialog).prop('open')).toBe(false)
  })

  // bringing this back in a later ticket
  // eslint-disable-next-line jest/no-commented-out-tests
  // it('displays the number of users recruited', () => {
  //   const InviteFriendsIcon = require('src/components/InviteFriendsIcon')
  //     .default
  //   const defaultMockProps = getMockProps()

  //   const wrapper = shallow(<InviteFriendsIcon {...defaultMockProps} />)
  //   wrapper.find(DashboardPopover).simulate('click')
  //   expect(wrapper.find('span').first().text()).toEqual('99999 friends ')
  // })
})

import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { windowOpenTop } from 'src/utils/navigation'
import { GET_SEARCH_URL, SFAC_FEEDBACK_LINK } from 'src/utils/urls'
import Notification from '../Notification'

jest.mock('src/utils/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  activityState: 'new',
  searchesToday: 5,
  totalSearches: 100,
})

describe('SfacActivityNotification component', () => {
  it('renders without error', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<SfacActivityNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('displays searches today and total searches counts', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(3).text()).toEqual(mockProps.searchesToday.toString())
    expect(typography.at(5).text()).toEqual(mockProps.totalSearches.toString())
  })

  it('show correct activity note, icon and copy in new mode', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(1).text()).toEqual('Inactive')
    expect(typography.at(2).text()).toEqual(
      'You can do even more good with our Search for a Cause extension. Searching raises up to 4x more for Trees than just opening tabs.'
    )
    expect(wrapper.find(DoNotDisturbOnIcon).exists()).toEqual(true)
  })

  it('has correct buttons, and not now button closes notification in new mode', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const button = wrapper.find(Button)

    expect(button.at(0).text()).toEqual('Not Now')

    button.at(0).simulate('click')
    expect(wrapper.find(Notification).first().prop('open')).toEqual(false)
  })

  it('has correct buttons, and get it now button opens get search page in new mode', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const button = wrapper.find(Button)

    expect(button.at(1).text()).toEqual('Get It Now')

    button.at(1).simulate('click')
    expect(windowOpenTop).toHaveBeenCalledWith(GET_SEARCH_URL)
  })

  it('show correct activity note, icon and copy in inactive mode', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = {
      ...getMockProps(),
      activityState: 'inactive',
    }
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(1).text()).toEqual('Inactive')
    expect(typography.at(2).text()).toEqual(
      'You haven’t used Search for Cause in a while! Searching raises up to 4x more for Trees than just opening tabs.'
    )
    expect(wrapper.find(DoNotDisturbOnIcon).exists()).toEqual(true)
  })

  it('has correct buttons, and not now button closes notification in inactive mode', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = {
      ...getMockProps(),
      activityState: 'inactive',
    }
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const button = wrapper.find(Button)

    expect(button.at(0).text()).toEqual('Feedback')

    button.at(0).simulate('click')
    expect(windowOpenTop).toHaveBeenCalledWith(SFAC_FEEDBACK_LINK)
  })

  it('has correct buttons, and get it now button opens get search page in inactive mode', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = {
      ...getMockProps(),
      activityState: 'inactive',
    }
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const button = wrapper.find(Button)

    expect(button.at(1).text()).toEqual('Activate Extension')

    button.at(1).simulate('click')
    expect(windowOpenTop).toHaveBeenCalledWith(GET_SEARCH_URL)
  })

  it('show correct activity note, icon, no buttons and copy in active mode', () => {
    const SfacActivityNotification =
      require('src/components/SfacActivityNotification').default
    const mockProps = {
      ...getMockProps(),
      activityState: 'active',
    }
    const wrapper = mount(<SfacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(1).text()).toEqual('Active')
    expect(typography.at(2).text()).toEqual(
      'Your searches are raising up to 4x more for Trees than just opening tabs. Great job!'
    )
    expect(wrapper.find(CheckCircleIcon).exists()).toEqual(true)
    expect(wrapper.find(Button).exists()).toEqual(false)
  })
})

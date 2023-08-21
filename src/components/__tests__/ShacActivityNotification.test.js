import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { shopLandingURL } from 'src/utils/urls'
import Link from 'src/components/Link'
import { currencyFormatUSD } from 'src/utils/formatting'

jest.mock('src/utils/navigation')

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  open: true,
  activityState: 'new',
  totalEarned: 150.25,
  impactName: 'Trees',
  onClose: jest.fn(),
})

describe('ShacActivityNotification component', () => {
  it('renders without error', () => {
    const ShacActivityNotification =
      require('src/components/ShacActivityNotification').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ShacActivityNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('displays searches today and total searches counts', () => {
    const ShacActivityNotification =
      require('src/components/ShacActivityNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(3).text()).toEqual(
      currencyFormatUSD(mockProps.totalEarned)
    )
  })

  it('show correct activity note, icon and copy in new mode', () => {
    const ShacActivityNotification =
      require('src/components/ShacActivityNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(1).text()).toEqual('Inactive')
    expect(typography.at(2).text()).toEqual(
      'You can do even more good with our Shop for a Cause extension. Shopping raises up to 4x more for Trees than just opening tabs.'
    )
    expect(wrapper.find(DoNotDisturbOnIcon).exists()).toEqual(true)
  })

  it('has a "get it now" button that links to the URL to get the SFAC extension', () => {
    const ShacActivityNotification =
      require('src/components/ShacActivityNotification').default
    const mockProps = getMockProps()
    const wrapper = mount(<ShacActivityNotification {...mockProps} />)
    const link = wrapper.find(Link).at(0)

    expect(link.text()).toEqual('Get it Now')
    expect(link.prop('to')).toEqual(shopLandingURL)
  })

  it('show correct activity note, icon and copy in inactive mode', () => {
    const ShacActivityNotification =
      require('src/components/ShacActivityNotification').default
    const mockProps = {
      ...getMockProps(),
      activityState: 'inactive',
    }
    const wrapper = mount(<ShacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(1).text()).toEqual('Inactive')
    expect(typography.at(2).text()).toEqual(
      'You haven’t used Shop for a Cause in a while! Shopping raises up to 4x more for Trees than just opening tabs.'
    )
    expect(wrapper.find(DoNotDisturbOnIcon).exists()).toEqual(true)
  })

  it('has correct buttons, and get it now button opens get search page in inactive mode', () => {
    const ShacActivityNotification =
      require('src/components/ShacActivityNotification').default
    const mockProps = {
      ...getMockProps(),
      activityState: 'inactive',
    }
    const wrapper = mount(<ShacActivityNotification {...mockProps} />)
    const link = wrapper.find(Link).at(0)

    expect(link.text()).toEqual('Activate Extension')
    expect(link.prop('to')).toEqual(shopLandingURL)
  })

  it('show correct activity note, icon, no buttons and copy in active mode', () => {
    const ShacActivityNotification =
      require('src/components/ShacActivityNotification').default
    const mockProps = {
      ...getMockProps(),
      activityState: 'active',
    }
    const wrapper = mount(<ShacActivityNotification {...mockProps} />)
    const typography = wrapper.find(Typography)

    expect(typography.at(1).text()).toEqual('Active')
    expect(typography.at(2).text()).toEqual(
      "You've been increasing your impact for causes by using Shop for a Cause. Great job!"
    )
    expect(wrapper.find(CheckCircleIcon).exists()).toEqual(true)
    expect(wrapper.find(Button).exists()).toEqual(false)
  })
})

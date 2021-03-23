import React from 'react'
import { shallow, mount } from 'enzyme'
import Button from '@material-ui/core/Button'

// import Typography from '@material-ui/core/Typography'
import Notification from 'src/components/Notification'
import ImpactDialog from 'src/components/ImpactDialog'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import preloadAll from 'jest-next-dynamic'

jest.mock('src/utils/mutations/UpdateImpactMutation')
jest.mock('@material-ui/core/Typography')
jest.mock('src/components/SocialShare', () => () => <div />)
jest.mock('src/components/InviteFriends', () => () => <div />)
jest.mock('src/utils/caching')
const getMockProps = (userImpactOverrides) => ({
  userImpact: {
    visitsUntilNextImpact: 3,
    pendingUserReferralImpact: 0,
    pendingUserReferralCount: 0,
    userImpactMetric: 2,
    confirmedImpact: true,
    hasClaimedLatestReward: false,
    ...userImpactOverrides,
  },
  user: {
    id: 'someId',
    username: 'someUsername',
  },
})
beforeEach(async () => {
  jest.clearAllMocks()
  await preloadAll()
})

describe('UserImpact component', () => {
  it('renders without error', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<UserImpact {...mockProps} />)
    }).not.toThrow()
  })

  it('renders an impact award notification if user hasnt claimed the most recent reward', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification)
    expect(notification.exists()).toBe(true)
  })

  it('does not render an impact award notification if user has claimed the most recent reward', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({ hasClaimedLatestReward: true })
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(0)
    expect(notification.exists()).not.toBe(true)
  })

  it('does not render an impact award notification if user has not yet confirmed', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(0)
    expect(notification.exists()).not.toBe(true)
  })

  it('renders a reward dialog if user clicks "hooray" in notification', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps()
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find(ImpactDialog).at(2).props().open).toBe(false)
    const notification = wrapper.find(Notification)
    notification.find(Button).simulate('click')
    expect(wrapper.find(ImpactDialog).at(2).props().open).toBe(true)
  })

  it('dismisses reward dialog and fires off correct updateImpact mutation', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps()
    const wrapper = mount(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(0)
    notification.find(Button).simulate('click')
    const rewardDialog = wrapper.find(ImpactDialog).at(2)
    rewardDialog.find(Button).simulate('click')
    expect(wrapper.find(ImpactDialog).at(2).props().open).toBe(false)
    expect(UpdateImpactMutation).toHaveBeenCalledWith(
      'someId',
      '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z',
      { claimLatestReward: true }
    )
  })

  it('shows confirm impact dialog if user has not confirmed', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find(ImpactDialog).at(0).props().open).toBe(true)
  })

  it('does not show confirm impact dialog if user has confirmed', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps()
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find(ImpactDialog).at(0).props().open).toBe(false)
  })

  it('dismisses the confirm Impact dialog fires off correct updateImpact mutation', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(ImpactDialog).at(0)
    expect(wrapper.find(ImpactDialog).at(0).props().open).toBe(true)
    confirmDialogue.find(Button).simulate('click')
    expect(wrapper.find(ImpactDialog).at(0).props().open).toBe(false)
    expect(UpdateImpactMutation).toHaveBeenCalledWith(
      'someId',
      '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z',
      { confirmImpact: true }
    )
  })

  it('confirming Impact dialog shows walkMe', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(ImpactDialog).at(0)
    expect(wrapper.find(ImpactDialog).at(1).props().open).toBe(false)
    confirmDialogue.find(Button).simulate('click')
    expect(wrapper.find(ImpactDialog).at(1).props().open).toBe(true)
  })

  it('closing walkMe calls setAlertDialogOpen', async () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(ImpactDialog).at(0)
    confirmDialogue.find(Button).simulate('click')
    await wrapper.find(ImpactDialog).at(1).invoke('onClose')()
    expect(wrapper.find(ImpactDialog).at(1).props().open).toBe(false)
  })

  it('does not render a referral award notification if user has no pending referrals', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    expect(notification.exists()).not.toBe(true)
  })

  it('does render referral award notification if user has pending referral impact', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
    })
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    expect(notification.exists()).toBe(true)
  })

  it('renders referral reward dialog correctly', async () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    expect(wrapper.find(ImpactDialog).at(3).props().open).toBe(false)
    notification.find(Button).simulate('click')
    expect(wrapper.find(ImpactDialog).at(3).props().open).toBe(true)
  })

  it('dismisses referral reward dialog and fires off correct updateImpact mutation', () => {
    const UserImpact = require('src/components/UserImpact').default
    const mockProps = getMockProps({
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    notification.find(Button).simulate('click')
    const rewardDialog = wrapper.find(ImpactDialog).at(3)
    rewardDialog.find(Button).simulate('click')
    expect(wrapper.find(ImpactDialog).at(3).props().open).toBe(false)
    expect(UpdateImpactMutation).toHaveBeenCalledWith(
      'someId',
      '6ce5ad8e-7dd4-4de5-ba4f-13868e7d212z',
      { claimPendingUserReferralImpact: true }
    )
  })
})

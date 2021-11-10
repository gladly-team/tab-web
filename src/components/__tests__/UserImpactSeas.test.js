import React from 'react'
import { shallow, mount } from 'enzyme'
import Button from '@material-ui/core/Button'

// import Typography from '@material-ui/core/Typography'
import Notification from 'src/components/Notification'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import preloadAll from 'jest-next-dynamic'
import confetti from 'canvas-confetti'
import { act } from 'react-dom/test-utils'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import Dialog from '@material-ui/core/Dialog'
import { STORAGE_SEAS_CAUSE_ID } from 'src/utils/constants'

jest.mock('next/router')
jest.mock('src/utils/featureFlags', () => ({
  showDevelopmentOnlyMissionsFeature: jest.fn(),
}))
jest.mock('src/utils/mutations/SetHasSeenSquadsMutation')
jest.mock('src/utils/mutations/UpdateImpactMutation')
jest.mock('@material-ui/core/Typography', () => () => <div />)
jest.mock('src/components/SocialShare', () => () => <div />)
jest.mock('src/components/EmailInviteDialog', () => () => <div />)
jest.mock('src/components/InviteFriends', () => () => <div />)
jest.mock('src/utils/caching')
jest.mock('canvas-confetti', () => ({
  create: jest.fn().mockReturnValue(() => {}),
}))
jest.mock('src/utils/localstorage-mgr', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

const getMockProps = (userImpactOverrides, userOverrides) => ({
  user: {
    id: 'someId',
    userImpact: {
      visitsUntilNextImpact: 3,
      pendingUserReferralImpact: 0,
      pendingUserReferralCount: 0,
      userImpactMetric: 2,
      confirmedImpact: true,
      hasClaimedLatestReward: false,
      ...userImpactOverrides,
    },
    cause: {
      landingPagePath: '/seas/',
      impactVisits: 27,
      impact: {
        impactCounterText:
          "##### **Your #teamseas impact!**\n\nThis shows how many plastic bottles you've helped remove from the ocean. Every tab you open helps. Keep it up",
        claimImpactSubtitle:
          '##### You did it! You just turned your tabs into removing trash from rivers and oceans.  Keep it up, and do good with every new tab!',
        referralRewardNotification:
          // eslint-disable-next-line no-template-curly-in-string
          "##### #teamseas.  To celebrate, we'll remove an extra ${pendingUserReferralImpact} water bottle${isPlural(pendingUserReferralImpact)} from our oceans and rivers",
        impactIcon: 'jellyfish',
        walkMeGif: 'dolphin.gif',
        referralRewardTitle:
          // eslint-disable-next-line no-template-curly-in-string
          '##### **You just cleaned up ${claimedReferralImpact} waterbottle${isPlural(claimedReferralImpact)} from our oceans and rivers**',
        referralRewardSubtitle:
          "##### Congratulations! You're making a huge impact on our oceans and rivers. Want to help our seas even more? Invite a few more friends!",
        newlyReferredImpactWalkthroughText:
          "##### Your friend started you off giving you credit for removing  5 plastic water bottles from our rivers and oceans, which is crucial to cleaning up our environment and fighting climate change. Open a new tab now to clean up your 6th waterbottle! We'll track how many water bottles you've helped clean up on the top of the page",
        impactWalkthroughText:
          "##### When you do, you'll donate enough to remove a plastic water bottle from a river or ocean.  We'll track how many water bottles you've helped clean up on the top of the page",
        confirmImpactSubtitle:
          "##### Each time you open a tab, you'll be helping restore the environment and fight climate change by [removing trash from our oceans and rivers](https://teamseas.org/).  Ready to get started?",
      },
    },
    username: 'someUsername',
    notifications: [],
    ...userOverrides,
  },
  disabled: false,
})
beforeEach(async () => {
  jest.clearAllMocks()
  await preloadAll()
})

describe('UserImpact component', () => {
  it('renders without error', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<UserImpact {...mockProps} />)
    }).not.toThrow()
  })

  it('renders an impact award notification if user hasnt claimed the most recent reward', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification)
    expect(notification.exists()).toBe(true)
  })

  it('does not render an impact award notification if user has claimed the most recent reward', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ hasClaimedLatestReward: true })
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(0)
    expect(notification.exists()).not.toBe(true)
  })

  it('does not render an impact award notification if user has not yet confirmed', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(0)
    expect(notification.exists()).not.toBe(true)
  })

  it('renders a reward dialog if user clicks "hooray" in notification', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps()
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find(Dialog).at(3).props().open).toBe(false)
    const notification = wrapper.find(Notification)
    notification.find(Button).simulate('click')
    expect(wrapper.find(Dialog).at(3).props().open).toBe(true)
  })

  it('dismisses the share dialog if dialog onclose is triggered', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps()
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find(Dialog).at(3).props().open).toBe(false)
    const notification = wrapper.find(Notification)
    notification.find(Button).simulate('click')
    act(() => {
      wrapper.find(Dialog).at(3).prop('onClose')()
    })
    wrapper.update()
    expect(wrapper.find(Dialog).at(3).prop('open')).toBe(false)
  })

  it('dismisses reward dialog and fires off correct updateImpact mutation', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps()
    const wrapper = mount(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(0)
    notification.find(Button).simulate('click')
    expect(UpdateImpactMutation).toHaveBeenCalledWith(
      'someId',
      STORAGE_SEAS_CAUSE_ID,
      { claimLatestReward: true }
    )
  })

  it('shows confirm impact dialog if user has not confirmed', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find(Dialog).at(0).props().open).toBe(true)
  })

  it('does not show confirm impact dialog if user has confirmed', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps()
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find(Dialog).at(0).props().open).toBe(false)
  })

  it('dismisses the confirm Impact dialog fires off correct updateImpact mutation', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(Dialog).at(0)
    expect(wrapper.find(Dialog).at(0).props().open).toBe(true)
    confirmDialogue.find(Button).simulate('click')
    expect(wrapper.find(Dialog).at(0).props().open).toBe(false)
    expect(UpdateImpactMutation).toHaveBeenCalledWith(
      'someId',
      STORAGE_SEAS_CAUSE_ID,
      { confirmImpact: true }
    )
  })

  it('dismisses the confirm Impact dialog fires off correct updateImpact mutation when the user has been refered', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({
      confirmedImpact: false,
      pendingUserReferralImpact: 5,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(Dialog).at(0)
    expect(wrapper.find(Dialog).at(0).props().open).toBe(true)
    confirmDialogue.find(Button).simulate('click')
    expect(wrapper.find(Dialog).at(0).props().open).toBe(false)
    expect(UpdateImpactMutation).toHaveBeenCalledWith(
      'someId',
      STORAGE_SEAS_CAUSE_ID,
      {
        confirmImpact: true,
        claimPendingUserReferralImpact: true,
        claimLatestReward: true,
      }
    )
  })

  it('confirming Impact dialog shows walkMe', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(Dialog).at(0)
    expect(wrapper.find(Dialog).at(2).props().open).toBe(false)
    confirmDialogue.find(Button).simulate('click')
    wrapper.update()
    expect(wrapper.find(Dialog).at(1).props().open).toBe(true)
  })

  it('confirming Impact dialog shows referral walkMe if user has been referred', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({
      confirmedImpact: false,
      pendingUserReferralImpact: 5,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(Dialog).at(0)
    expect(wrapper.find(Dialog).at(1).props().open).toBe(false)
    confirmDialogue.find(Button).simulate('click')
    expect(wrapper.find(Dialog).at(2).props().open).toBe(true)
  })

  it('closing walkMe calls setAlertDialogOpen', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ confirmedImpact: false })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(Dialog).at(0)
    confirmDialogue.find(Button).simulate('click')
    await wrapper.find(Dialog).at(1).invoke('onClose')()
    expect(wrapper.find(Dialog).at(1).props().open).toBe(false)
  })

  it('closing referral walkMe calls setNewlyReferredDialogOpen', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({
      confirmedImpact: false,
      pendingUserReferralImpact: 5,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const confirmDialogue = wrapper.find(Dialog).at(0)
    confirmDialogue.find(Button).simulate('click')
    await wrapper.find(Dialog).at(2).invoke('onClose')()
    expect(wrapper.find(Dialog).at(2).props().open).toBe(false)
  })

  it('does not render a referral award notification if user has no pending referrals', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    expect(notification.exists()).not.toBe(true)
  })

  it('does render referral award notification if user has pending referral impact', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
    })
    const wrapper = shallow(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    expect(notification.exists()).toBe(true)
  })

  it('renders referral reward dialog correctly', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    expect(wrapper.find(Dialog).at(4).props().open).toBe(false)
    notification.find(Button).simulate('click')
    expect(wrapper.find(Dialog).at(4).props().open).toBe(true)
  })

  it('fires off correct updateImpact mutation when use claims impact on referral notification', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    notification.find(Button).simulate('click')
    expect(UpdateImpactMutation).toHaveBeenCalledWith(
      'someId',
      STORAGE_SEAS_CAUSE_ID,
      { claimPendingUserReferralImpact: true }
    )
  })

  it('dismisses referral reward dialog', () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({
      pendingUserReferralImpact: 10,
      pendingUserReferralCount: 1,
    })
    const wrapper = mount(<UserImpact {...mockProps} />)
    const notification = wrapper.find(Notification).at(1)
    notification.find(Button).simulate('click')
    const rewardDialog = wrapper.find(Dialog).at(4)
    rewardDialog.find(Button).simulate('click')
    expect(wrapper.find(Dialog).at(4).props().open).toBe(false)
  })

  it('renders the confetti canvas if a user hits 100 percent on the progress bar', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ visitsUntilNextImpact: 27 })
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find('canvas').length).toBe(1)
  })

  it('does not render the confetti canvas if a user isnt at 100 percent', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ visitsUntilNextImpact: 2 })
    const wrapper = mount(<UserImpact {...mockProps} />)
    expect(wrapper.find('canvas').length).toBe(0)
  })

  it('launches confetti if a user hits 100 percent on the progress bar and only fires once', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ visitsUntilNextImpact: 1 })
    const wrapper = mount(<UserImpact {...mockProps} />)
    wrapper.setProps(getMockProps({ visitsUntilNextImpact: 27 }))
    await act(async () => {
      flushAllPromises()
    })
    expect(confetti.create).toHaveBeenCalledTimes(1)
  })

  it('does not launch the confetti if a user is not at 100% progress', async () => {
    const UserImpact = require('src/components/UserImpactSeas').default
    const mockProps = getMockProps({ visitsUntilNextImpact: 12 })
    mount(<UserImpact {...mockProps} />)
    expect(confetti.create).toHaveBeenCalledTimes(0)
  })
})

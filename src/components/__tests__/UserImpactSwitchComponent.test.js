import React from 'react'
import { shallow } from 'enzyme'
import UserImpactCats from '../UserImpactCats'
import UserImpactSeas from '../UserImpactSeas'

const getMockProps = (userImpactOverrides, causeOverrides) => ({
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
      ...causeOverrides,
    },
    username: 'someUsername',
    notifications: [],
  },
  disabled: false,
})

describe('UserImpact component', () => {
  it('renders without error', () => {
    const UserImpactSwitch =
      require('src/components/UserImpactSwitchComponent').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<UserImpactSwitch {...mockProps} />)
    }).not.toThrow()
  })

  it('renders cats impact by default', () => {
    const UserImpactSwitch =
      require('src/components/UserImpactSwitchComponent').default
    const mockProps = getMockProps()
    const wrapper = shallow(<UserImpactSwitch {...mockProps} />)
    const userImpact = wrapper.find(UserImpactCats)
    expect(userImpact.exists()).toBe(true)
  })

  it('renders seas impact if path is /teamseas/', () => {
    const UserImpactSwitch =
      require('src/components/UserImpactSwitchComponent').default
    const mockProps = getMockProps({}, { landingPagePath: '/teamseas/' })
    const wrapper = shallow(<UserImpactSwitch {...mockProps} />)
    const userImpact = wrapper.find(UserImpactSeas)
    expect(userImpact.exists()).toBe(true)
  })
})

import React from 'react'
import SetHasSeenCompletedMissionMutation from 'src/utils/mutations/SetHasSeenCompletedMissionMutation'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import IconButton from '@material-ui/core/IconButton'
import { mount, shallow } from 'enzyme'
import { Button, Typography } from '@material-ui/core'
import { MISSION_STARTED } from 'src/utils/constants'
import { goTo } from 'src/utils/navigation'
import { missionHubURL } from 'src/utils/urls'
import Notification from '../Notification'
import SquadInviteResponseMutation from '../../utils/mutations/SquadInviteResponseMutation'
import UpdateMissionNotificationMutation from '../../utils/mutations/UpdateMissionNotificationMutation'

jest.mock('src/utils/mutations/SetHasSeenCompletedMissionMutation')
jest.mock('src/utils/mutations/SquadInviteResponseMutation')
jest.mock('src/utils/mutations/UpdateMissionNotificationMutation')
jest.mock('src/utils/navigation', () => ({ goTo: jest.fn() }))

afterEach(() => {
  jest.clearAllMocks()
})

const getMockProps = () => ({
  userId: 'abcdefghijklmno',
  currentMission: {
    missionId: 'missionId',
    status: 'started',
    squadName: 'brick squad',
    tabGoal: 1000,
    tabCount: 250,
    acknowledgedMissionComplete: false,
    acknowledgedMissionStarted: false,
    squadMembers: [],
    endOfMissionAwards: [],
  },
  pendingMissionInvites: [
    {
      invitingUser: { name: 'jed' },
      missionId: '12345',
    },
  ],
})

describe('MissionNotification component', () => {
  it('renders without error', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<MissionNotification {...mockProps} />)
    }).not.toThrow()
  })

  it('displays nothing if empty inputs', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      pendingMissionInvites: [],
      currentMission: null,
    }
    const wrapper = shallow(<MissionNotification {...mockProps} />)
    expect(wrapper.type()).toEqual(null)
  })

  it('displays pending mission invite if no currentMission', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      currentMission: null,
    }
    const wrapper = mount(<MissionNotification {...mockProps} />)
    const notification = wrapper.find(Notification).first()
    expect(notification.find(Typography).first().text()).toEqual(
      'You got a squad invite!'
    )
    expect(notification.find(Typography).at(1).text()).toContain(
      'jed sent you an invite'
    )
  })

  it('calls accept invite if user clicks respective button, and redirects to mission hub', async () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      currentMission: null,
    }
    const wrapper = mount(<MissionNotification {...mockProps} />)
    const notification = wrapper.find(Notification).first()
    const acceptButton = notification.find(Button).last()
    const pendingInvite = mockProps.pendingMissionInvites[0]
    acceptButton.simulate('click')
    expect(SquadInviteResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      pendingInvite.missionId,
      true
    )
    await flushAllPromises()
    wrapper.update()
    expect(goTo).toHaveBeenCalled()
  })

  it('calls reject invite if user clicks respective button, and closes notification', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      currentMission: null,
    }
    const wrapper = mount(<MissionNotification {...mockProps} />)
    let notification = wrapper.find(Notification).first()
    const rejectButton = notification.find(Button).first()
    const pendingInvite = mockProps.pendingMissionInvites[0]
    rejectButton.simulate('click')
    expect(SquadInviteResponseMutation).toHaveBeenCalledWith(
      mockProps.userId,
      pendingInvite.missionId,
      false
    )
    notification = wrapper.find(Notification).first()
    expect(notification.prop('open')).toEqual(false)
  })

  it('displays acknowledge mission started notification if applicable', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<MissionNotification {...mockProps} />)
    const notification = wrapper.find(Notification).first()
    expect(notification.find(Typography).first().text()).toEqual(
      'Your mission has started!'
    )
  })

  it('click acknowledge mission started calls mutation and closes notification', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<MissionNotification {...mockProps} />)
    const notification = wrapper.find(Notification).first()

    const clickButton = notification.find(Button).first()
    clickButton.simulate('click')
    expect(UpdateMissionNotificationMutation).toHaveBeenCalledWith(
      mockProps.userId,
      mockProps.currentMission.missionId,
      MISSION_STARTED
    )
    expect(goTo).toHaveBeenCalledWith(missionHubURL)
  })
  it('dismissing acknowledge mission started calls mutation and closes notification and does not redirect', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = getMockProps()
    const wrapper = mount(<MissionNotification {...mockProps} />)
    const closeButton = wrapper.find(IconButton).first()
    closeButton.simulate('click')
    wrapper.update()
    expect(UpdateMissionNotificationMutation).toHaveBeenCalledWith(
      mockProps.userId,
      mockProps.currentMission.missionId,
      MISSION_STARTED
    )
    expect(goTo).not.toHaveBeenCalledWith(missionHubURL)
  })

  it('displays acknowledge mission completed notification if applicable', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      currentMission: {
        missionId: 'missionId',
        status: 'completed',
        squadName: 'brick squad',
        tabGoal: 1000,
        tabCount: 1000,
        acknowledgedMissionComplete: false,
        acknowledgedMissionStarted: true,
        squadMembers: [],
        endOfMissionAwards: [],
      },
    }

    const wrapper = mount(<MissionNotification {...mockProps} />)
    const notification = wrapper.find(Notification).first()
    expect(notification.find(Typography).first().text()).toEqual(
      'Mission Completed!'
    )
  })

  it('click acknowledge mission completed navigates to page', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      currentMission: {
        missionId: 'missionId',
        status: 'completed',
        squadName: 'brick squad',
        tabGoal: 1000,
        tabCount: 1000,
        acknowledgedMissionComplete: false,
        acknowledgedMissionStarted: true,
        squadMembers: [],
        endOfMissionAwards: [],
      },
    }

    const wrapper = mount(<MissionNotification {...mockProps} />)
    const notification = wrapper.find(Notification).first()

    const clickButton = notification.find(Button).first()
    clickButton.simulate('click')
    expect(goTo).toHaveBeenCalledWith(missionHubURL)
  })

  it('dismissing acknowledge mission complete calls mutation and closes notification and does not redirect', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      currentMission: {
        missionId: 'missionId',
        status: 'completed',
        squadName: 'brick squad',
        tabGoal: 1000,
        tabCount: 1000,
        acknowledgedMissionComplete: false,
        acknowledgedMissionStarted: true,
        squadMembers: [],
        endOfMissionAwards: [],
      },
    }
    const wrapper = mount(<MissionNotification {...mockProps} />)
    const closeButton = wrapper.find(IconButton).first()
    closeButton.simulate('click')
    wrapper.update()
    expect(SetHasSeenCompletedMissionMutation).toHaveBeenCalledWith(
      mockProps.userId,
      mockProps.currentMission.missionId
    )
    expect(goTo).not.toHaveBeenCalledWith(missionHubURL)
  })

  it('displays nothing if in mission', () => {
    const MissionNotification = require('src/components/MissionNotification')
      .default
    const mockProps = {
      ...getMockProps(),
      currentMission: {
        missionId: 'missionId',
        status: 'pending',
        squadName: 'brick squad',
        tabGoal: 1000,
        tabCount: 250,
        acknowledgedMissionComplete: false,
        acknowledgedMissionStarted: true,
        squadMembers: [],
        endOfMissionAwards: [],
      },
    }

    const wrapper = shallow(<MissionNotification {...mockProps} />)
    expect(wrapper.type()).toEqual(null)
  })
})

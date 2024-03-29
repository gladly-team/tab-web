import React from 'react'
import merge from 'lodash/merge'
import { mount } from 'enzyme'
import Button from '@material-ui/core/Button'
import preloadAll from 'jest-next-dynamic'
import { act } from 'react-dom/test-utils'
import { ThemeProvider } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import theme from 'src/utils/theme'
import CreateNewMissionMutation from 'src/utils/mutations/CreateNewMissionMutation'
import MissionSocialShare from 'src/components/missionComponents/MissionSocialShare'
import TableRow from '@material-ui/core/TableRow'
import MissionComplete from 'src/components/missionComponents/MissionComplete'
import CurrentMission from 'src/components/missionComponents/CurrentMission'
import RestartMissionMutation from 'src/utils/mutations/RestartMissionMutation'
import SquadInviteResponseMutation from 'src/utils/mutations/SquadInviteResponseMutation'

jest.mock('src/utils/mutations/SquadInviteResponseMutation', () => jest.fn())
jest.mock('src/utils/mutations/RestartMissionMutation', () => jest.fn())
jest.mock('src/utils/mutations/CreateNewMissionMutation', () => jest.fn())
jest.mock('src/components/InviteFriends', () => () => <div />)
jest.mock('src/utils/caching')
jest.mock('src/utils/localstorage-mgr', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))
jest.mock('src/utils/navigation', () => ({
  goTo: jest.fn(),
}))

const mockPropsNoMission = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: null,
  },
}
const mockPropsNoInvites = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: {
      completed: null,
      endOfMissionAwards: [],
      missionId: '1ICcqd27-',
      squadMembers: [
        { invitedEmail: null, status: 'accepted', tabs: 0, username: 'alec' },
      ],
      squadName: 'asdd',
      started: null,
      status: 'pending',
      tabCount: 0,
    },
  },
}
const mockPropsMissionInProgress = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: {
      squadName: 'TestSquad',
      started: '2017-07-11T03:05:12Z',
      completed: null,
      missionId: '123456789',
      status: 'started',
      tabGoal: 1000,
      tabCount: 900,
      squadMembers: [
        { username: 'kevin', invitedEmail: null, status: 'accepted', tabs: 66 },
        { username: 'alec', invitedEmail: null, status: 'accepted', tabs: 834 },
        {
          username: null,
          invitedEmail: 'alec+897234@tabforacause.org',
          status: 'pending',
          tabs: 0,
        },
        {
          username: null,
          invitedEmail: 'alec+1s@tabforacause.org',
          status: 'pending',
          tabs: 0,
        },
      ],
      endOfMissionAwards: [
        { user: 'abcdefghijklmno', awardType: 'Consistent Kitty', unit: 6 },
        { user: 'omnlkjihgfedcba', awardType: 'Hot Paws', unit: 20 },
        {
          user: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
          awardType: 'All-Star Fur Ball',
          unit: 258,
        },
      ],
    },
  },
}
const mockPropsMissionCompleted = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: {
      squadName: 'TestSquad',
      started: '2017-07-11T03:05:12Z',
      completed: '2017-07-11T03:05:12Z',
      missionId: '123456789',
      status: 'completed',
      tabGoal: 1000,
      tabCount: 100,
      squadMembers: [
        { username: 'kevin', invitedEmail: null, status: 'accepted', tabs: 66 },
        { username: 'alec', invitedEmail: null, status: 'accepted', tabs: 934 },
        {
          username: null,
          invitedEmail: 'alec+897234@tabforacause.org',
          status: 'pending',
          tabs: 0,
        },
        {
          username: null,
          invitedEmail: 'alec+1s@tabforacause.org',
          status: 'pending',
          tabs: 0,
        },
      ],
      endOfMissionAwards: [
        { user: 'abcdefghijklmno', awardType: 'Consistent Kitty', unit: 6 },
        { user: 'omnlkjihgfedcba', awardType: 'Hot Paws', unit: 20 },
        {
          user: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
          awardType: 'All-Star Fur Ball',
          unit: 258,
        },
      ],
    },
  },
}
beforeEach(async () => {
  jest.clearAllMocks()
  await preloadAll()
})

describe('Current Mission component', () => {
  it('renders without error', () => {
    const mockProps = mockPropsNoMission
    expect(() => {
      mount(
        <ThemeProvider theme={theme}>
          <CurrentMission {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })
  it('renders the new mission view when a user is not in a mission', () => {
    expect.assertions(2)
    const mockProps = mockPropsNoMission
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    const status = wrapper
      .find(Typography)
      .filterWhere((elem) => elem.text() === 'Status: ')
    expect(status.length).toEqual(0)
    const createSquadText = wrapper
      .find(Typography)
      .filterWhere((elem) => elem.text() === 'Create your squad now!')
    expect(createSquadText.length).toEqual(1)
  })

  it('validates the squad name when creating a squad', () => {
    expect.assertions(2)
    const mockProps = mockPropsNoMission
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    const squadNameInput = wrapper.find(TextField)
    squadNameInput.find('input').simulate('change', { target: { value: 'ab' } })
    wrapper.update()
    expect(wrapper.find(Button).prop('disabled')).toEqual(true)
    squadNameInput
      .find('input')
      .simulate('change', { target: { value: 'abcd' } })
    wrapper.update()
    expect(wrapper.find(Button).prop('disabled')).toEqual(false)
  })

  it('creates a squad and returns the id when a user enters a squad name and submits', async () => {
    expect.assertions(3)
    CreateNewMissionMutation.mockReturnValue({
      createNewMission: { currentMission: '123' },
    })
    const mockProps = mockPropsNoMission
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    const squadNameInput = wrapper.find(TextField)
    squadNameInput
      .find('input')
      .simulate('change', { target: { value: 'abcd' } })
    wrapper.update()
    expect(wrapper.find(Button).prop('disabled')).toEqual(false)
    await act(async () => {
      wrapper.find(Button).simulate('click')
    })
    expect(wrapper.find(MissionSocialShare)).toBeTruthy()
    expect(CreateNewMissionMutation).toHaveBeenCalledWith(
      'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
      'abcd'
    )
  })

  it('loads the email invite if a user has created a mission but hasnt invited anyone', async () => {
    expect.assertions(1)
    CreateNewMissionMutation.mockReturnValue({
      createNewMission: { currentMission: '123' },
    })
    const mockProps = mockPropsNoInvites
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(MissionSocialShare).exists()).toBe(true)
  })

  it('loads a progress bar if the mission is in progress', async () => {
    expect.assertions(2)
    const mockProps = mockPropsMissionInProgress
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
    expect(wrapper.find(LinearProgress).exists()).toBe(true)
  })

  it('loads a table if the mission is in progress and has a row for every user plus title row', async () => {
    expect.assertions(3)
    const mockProps = mockPropsMissionInProgress
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
    expect(wrapper.find(Table).exists()).toBe(true)
    expect(wrapper.find(TableRow)).toHaveLength(5)
  })

  it('the add squad mate button is present for in progress missions and expands out to the mission invite component', async () => {
    expect.assertions(2)
    const mockProps = mockPropsMissionInProgress
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
    await act(async () => {
      wrapper.find(Button).simulate('click')
    })
    wrapper.update()
    expect(wrapper.find(MissionSocialShare).exists()).toBe(true)
  })

  it('when a mission is complete, the mission complete component is rendered', async () => {
    expect.assertions(2)
    const mockProps = mockPropsMissionCompleted
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
    expect(wrapper.find(MissionComplete).exists()).toBe(true)
  })

  it('when a mission is complete, and no one has restarted a mission, clicking restart mission calls restartMissionMutation', async () => {
    expect.assertions(2)
    const mockProps = mockPropsMissionCompleted
    RestartMissionMutation.mockReturnValue({
      restartMission: { currentMission: {} },
    })
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    const restartButton = wrapper.find(Button)
    await act(async () => {
      restartButton.simulate('click')
    })
    expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
    expect(RestartMissionMutation).toHaveBeenCalledWith(
      'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
      '123456789'
    )
  })

  it('when a mission is complete,someone has restarted a mission, clicking accept invite joins restarted mission', async () => {
    expect.assertions(2)
    const mockProps = merge(mockPropsMissionCompleted, {
      user: {
        pendingMissionInvites: [
          { missionId: 'missionId', invitingUser: { name: 'kevin' } },
        ],
      },
    })
    RestartMissionMutation.mockReturnValue({
      restartMission: { currentMission: {} },
    })
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    const acceptButton = wrapper.find(Button).at(1)
    await act(async () => {
      acceptButton.simulate('click')
    })
    expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
    expect(SquadInviteResponseMutation).toHaveBeenCalledWith(
      'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
      'missionId',
      true
    )
  })

  it('when a mission is complete,someone has restarted a mission, clicking reject invite rejects invited mission', async () => {
    expect.assertions(2)
    const mockProps = merge(mockPropsMissionCompleted, {
      user: {
        pendingMissionInvites: [
          { missionId: 'missionId', invitingUser: { name: 'kevin' } },
        ],
      },
    })
    RestartMissionMutation.mockReturnValue({
      restartMission: { currentMission: {} },
    })
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <CurrentMission {...mockProps} />
      </ThemeProvider>
    )
    const acceptButton = wrapper.find(Button).at(0)
    await act(async () => {
      acceptButton.simulate('click')
    })
    expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
    expect(SquadInviteResponseMutation).toHaveBeenCalledWith(
      'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
      'missionId',
      false
    )
  })
})

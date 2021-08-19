import React from 'react'
import { mount } from 'enzyme'
import Button from '@material-ui/core/Button'

// import Typography from '@material-ui/core/Typography'
import preloadAll from 'jest-next-dynamic'
import { act } from 'react-dom/test-utils'
import { ThemeProvider } from '@material-ui/core/styles'
import NoCompletedMissions from 'src/assets/images/noCompletedMissions.svg'
import LinearProgress from '@material-ui/core/LinearProgress'
import MuiAccordion from '@material-ui/core/Accordion'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Table from '@material-ui/core/Table'
import theme from 'src/utils/theme'
import CreateNewMissionMutation from 'src/utils/mutations/CreateNewMissionMutation'
import MissionSocialShare from 'src/components/MissionComponents/MissionSocialShare'
import TableRow from '@material-ui/core/TableRow'
import MissionComplete from 'src/components/MissionComponents/MissionComplete'

jest.mock('src/utils/mutations/CreateNewMissionMutation', () => jest.fn())
jest.mock('src/components/InviteFriends', () => () => <div />)
jest.mock('src/components/MissionComponents/MissionComplete', () => () => (
  <div />
))
jest.mock('src/utils/caching')
jest.mock('src/utils/localstorage-mgr', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

const mockPropsWithPastMissions = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: { status: 'started' },
    pastMissions: {
      edges: [
        {
          node: {
            squadName: 'TestSquad',
            started: '2017-05-11T03:05:12Z',
            completed: '2017-05-19T07:05:12Z',
            missionId: '111456789',
            status: 'completed',
            tabGoal: 1000,
            tabCount: 234,
            squadMembers: [
              {
                username: 'alec',
                invitedEmail: null,
                status: 'accepted',
                tabs: 234,
              },
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
              {
                user: 'abcdefghijklmno',
                awardType: 'Consistent Kitty',
                unit: 6,
              },
              { user: 'omnlkjihgfedcba', awardType: 'Hot Paws', unit: 20 },
              {
                user: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
                awardType: 'All-Star Fur Ball',
                unit: 258,
              },
            ],
          },
        },
        {
          node: {
            squadName: 'TestSquad',
            started: '2017-06-11T03:05:12Z',
            completed: '2017-06-19T07:05:12Z',
            missionId: '113456789',
            status: 'completed',
            tabGoal: 1000,
            tabCount: 300,
            squadMembers: [
              {
                username: 'kevin',
                invitedEmail: null,
                status: 'accepted',
                tabs: 66,
              },
              {
                username: 'alec',
                invitedEmail: null,
                status: 'accepted',
                tabs: 234,
              },
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
              {
                user: 'abcdefghijklmno',
                awardType: 'Consistent Kitty',
                unit: 6,
              },
              { user: 'omnlkjihgfedcba', awardType: 'Hot Paws', unit: 20 },
              {
                user: 'cL5KcFKHd9fEU5C9Vstj3g4JAc73',
                awardType: 'All-Star Fur Ball',
                unit: 258,
              },
            ],
          },
        },
      ],
    },
  },
}
const mockPropsNoPastMissions = {
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
    pastMissions: { edges: [] },
  },
}
beforeEach(async () => {
  jest.clearAllMocks()
  await preloadAll()
})

describe('Past Missions component', () => {
  it('renders without error', () => {
    const PastMissions = require('src/components/MissionComponents/PastMissions')
      .default
    const mockProps = mockPropsNoPastMissions
    expect(() => {
      mount(
        <ThemeProvider theme={theme}>
          <PastMissions {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })

  it('shows no past missions background if user has no past missions', () => {
    expect.assertions(1)
    const PastMissions = require('src/components/MissionComponents/PastMissions')
      .default
    const mockProps = mockPropsNoPastMissions
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <PastMissions {...mockProps} />
      </ThemeProvider>
    )
    const noMissionsImg = wrapper
      .find('img')
      .filterWhere((elem) => elem.prop('src') === NoCompletedMissions)
    expect(noMissionsImg.exists()).toBe(true)
  })

  it('renders completed missions without error', () => {
    const PastMissions = require('src/components/MissionComponents/PastMissions')
      .default
    const mockProps = mockPropsWithPastMissions
    expect(() => {
      mount(
        <ThemeProvider theme={theme}>
          <PastMissions {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })

  it('clicking on a completed mission shows mission details', async () => {
    expect.assertions(2)
    const PastMissions = require('src/components/MissionComponents/PastMissions')
      .default
    const mockProps = mockPropsWithPastMissions
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <PastMissions {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(MissionComplete).exists()).toBe(false)
    wrapper.find(MuiAccordion).simulate('change')
    expect(wrapper.find(MissionComplete).exists()).toBe(true)
  })
  //   it('renders the new mission view when a user is not in a mission', () => {
  //     expect.assertions(2)
  //     const PastMissions = require('src/components/MissionComponents/PastMissions')
  //       .default
  //     const mockProps = mockPropsNoMission
  //   const wrapper = mount(
  //     <ThemeProvider theme={theme}>
  //       <PastMissions {...mockProps} />
  //     </ThemeProvider>
  //   )
  //     const status = wrapper
  //       .find(Typography)
  //       .filterWhere((elem) => elem.text() === 'Status: ')
  //     expect(status.length).toEqual(0)
  //     const createSquadText = wrapper
  //       .find(Typography)
  //       .filterWhere((elem) => elem.text() === 'Create Your squad now!')
  //     expect(createSquadText.length).toEqual(1)
  //   })

  //   it('validates the squad name when creating a squad', () => {
  //     expect.assertions(2)
  //     const CurrentMission = require('src/components/MissionComponents/CurrentMission')
  //       .default
  //     const mockProps = mockPropsNoMission
  //     const wrapper = mount(
  //       <ThemeProvider theme={theme}>
  //         <CurrentMission {...mockProps} />
  //       </ThemeProvider>
  //     )
  //     const squadNameInput = wrapper.find(TextField)
  //     squadNameInput.find('input').simulate('change', { target: { value: 'ab' } })
  //     wrapper.update()
  //     expect(wrapper.find(Button).prop('disabled')).toEqual(true)
  //     squadNameInput
  //       .find('input')
  //       .simulate('change', { target: { value: 'abcd' } })
  //     wrapper.update()
  //     expect(wrapper.find(Button).prop('disabled')).toEqual(false)
  //   })

  //   it('creates a squad and returns the id when a user enters a squad name and submits', async () => {
  //     expect.assertions(3)
  //     const CurrentMission = require('src/components/MissionComponents/CurrentMission')
  //       .default
  //     CreateNewMissionMutation.mockReturnValue({
  //       createNewMission: { currentMission: '123' },
  //     })
  //     const mockProps = mockPropsNoMission
  //     const wrapper = mount(
  //       <ThemeProvider theme={theme}>
  //         <CurrentMission {...mockProps} />
  //       </ThemeProvider>
  //     )
  //     const squadNameInput = wrapper.find(TextField)
  //     squadNameInput
  //       .find('input')
  //       .simulate('change', { target: { value: 'abcd' } })
  //     wrapper.update()
  //     expect(wrapper.find(Button).prop('disabled')).toEqual(false)
  //     await act(async () => {
  //       wrapper.find(Button).simulate('click')
  //     })
  //     expect(wrapper.find(MissionSocialShare)).toBeTruthy()
  //     expect(CreateNewMissionMutation).toHaveBeenCalledWith(
  //       'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
  //       'abcd'
  //     )
  //   })

  //   it('loads the email invite if a user has created a mission but hasnt invited anyone', async () => {
  //     expect.assertions(1)
  //     const CurrentMission = require('src/components/MissionComponents/CurrentMission')
  //       .default
  //     CreateNewMissionMutation.mockReturnValue({
  //       createNewMission: { currentMission: '123' },
  //     })
  //     const mockProps = mockPropsNoInvites
  //     const wrapper = mount(
  //       <ThemeProvider theme={theme}>
  //         <CurrentMission {...mockProps} />
  //       </ThemeProvider>
  //     )
  //     expect(wrapper.find(MissionSocialShare).exists()).toBe(true)
  //   })

  //   it('loads a progress bar if the mission is in progress', async () => {
  //     expect.assertions(2)
  //     const CurrentMission = require('src/components/MissionComponents/CurrentMission')
  //       .default
  //     const mockProps = mockPropsMissionInProgress
  //     const wrapper = mount(
  //       <ThemeProvider theme={theme}>
  //         <CurrentMission {...mockProps} />
  //       </ThemeProvider>
  //     )
  //     expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
  //     expect(wrapper.find(LinearProgress).exists()).toBe(true)
  //   })

  //   it('loads a table if the mission is in progress and has a row for every user plus title row', async () => {
  //     expect.assertions(3)
  //     const CurrentMission = require('src/components/MissionComponents/CurrentMission')
  //       .default
  //     const mockProps = mockPropsMissionInProgress
  //     const wrapper = mount(
  //       <ThemeProvider theme={theme}>
  //         <CurrentMission {...mockProps} />
  //       </ThemeProvider>
  //     )
  //     expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
  //     expect(wrapper.find(Table).exists()).toBe(true)
  //     expect(wrapper.find(TableRow)).toHaveLength(5)
  //   })

  //   it('the add squad mate button is present for in progress missions and expands out to the mission invite component', async () => {
  //     expect.assertions(2)
  //     const CurrentMission = require('src/components/MissionComponents/CurrentMission')
  //       .default
  //     const mockProps = mockPropsMissionInProgress
  //     const wrapper = mount(
  //       <ThemeProvider theme={theme}>
  //         <CurrentMission {...mockProps} />
  //       </ThemeProvider>
  //     )
  //     expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
  //     await act(async () => {
  //       wrapper.find('[data-test-id="addSquadMateButton"]').simulate('click')
  //     })
  //     wrapper.update()
  //     expect(wrapper.find(MissionSocialShare).exists()).toBe(true)
  //   })

  //   it('when a mission is complete, the mission complete component is rendered', async () => {
  //     expect.assertions(2)
  //     const CurrentMission = require('src/components/MissionComponents/CurrentMission')
  //       .default
  //     const mockProps = mockPropsPastMissionsd
  //     const wrapper = mount(
  //       <ThemeProvider theme={theme}>
  //         <CurrentMission {...mockProps} />
  //       </ThemeProvider>
  //     )
  //     expect(wrapper.find(MissionSocialShare).exists()).toBe(false)
  //     expect(wrapper.find(PastMissions).exists()).toBe(true)
  //   })
})

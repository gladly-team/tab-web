import React from 'react'
import { mount } from 'enzyme'

// import Typography from '@material-ui/core/Typography'
import preloadAll from 'jest-next-dynamic'
import { act } from 'react-dom/test-utils'
import { ThemeProvider } from '@material-ui/core/styles'
import NoCompletedMissions from 'src/assets/images/noCompletedMissions.svg'
import MuiAccordion from '@material-ui/core/Accordion'
import theme from 'src/utils/theme'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

jest.mock('src/utils/mutations/CreateNewMissionMutation', () => jest.fn())
jest.mock('src/components/InviteFriends', () => () => <div />)
jest.mock('src/components/missionComponents/MissionComplete', () => () => (
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
    const PastMissions = require('src/components/missionComponents/PastMissions')
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
    const PastMissions = require('src/components/missionComponents/PastMissions')
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
    const PastMissions = require('src/components/missionComponents/PastMissions')
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
    const PastMissions = require('src/components/missionComponents/PastMissions')
      .default
    const mockProps = mockPropsWithPastMissions
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <PastMissions {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(MuiAccordion).at(1).prop('expanded')).toBe(false)
    await act(async () => {
      wrapper.find(ExpandMoreIcon).at(1).simulate('click')
    })

    wrapper.update()
    expect(wrapper.find(MuiAccordion).at(1).prop('expanded')).toBe(true)
  })
})

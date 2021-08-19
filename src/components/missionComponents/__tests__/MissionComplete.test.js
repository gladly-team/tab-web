import React from 'react'
import { mount } from 'enzyme'

// import Typography from '@material-ui/core/Typography'
import preloadAll from 'jest-next-dynamic'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from 'src/utils/theme'
import AcheivementBadge from 'src/components/AcheivementBadge'

const mockPropsMission = {
  mission: {
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
  user: { username: 'test' },
}

beforeEach(async () => {
  jest.clearAllMocks()
  await preloadAll()
})

describe('Mission Complete Presentational Component', () => {
  it('renders without error', () => {
    const MissionComplete = require('src/components/missionComponents/MissionComplete')
      .default
    const mockProps = mockPropsMission
    expect(() => {
      mount(
        <ThemeProvider theme={theme}>
          <MissionComplete {...mockProps} />
        </ThemeProvider>
      )
    }).not.toThrow()
  })

  it('renders the acheivement badges for each award', () => {
    const MissionComplete = require('src/components/missionComponents/MissionComplete')
      .default
    const mockProps = mockPropsMission
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MissionComplete {...mockProps} />
      </ThemeProvider>
    )
    expect(wrapper.find(AcheivementBadge).length).toBe(3)
  })
})

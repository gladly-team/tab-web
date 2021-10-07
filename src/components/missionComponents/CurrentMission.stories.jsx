import React, { useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SquadIcon from 'src/assets/icons/SquadIcon'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import CurrentMission from './CurrentMission'

export default {
  title: 'Views/Missions/CurrentMission',
  component: CurrentMission,
  parameters: {
    backgrounds: {
      default: 'grey',
      values: [{ name: 'grey', value: '#E5E5E5' }],
    },
  },
}

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    background: theme.palette.colors.backgroundGrey,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowX: 'hidden',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '88%',
    maxWidth: '1276px',
    marginTop: '170px',
    alignItems: 'center',
  },
  headerSection: {
    width: '91%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '1280px',
    paddingTop: theme.spacing(4),
    position: 'fixed',
    background: theme.palette.colors.backgroundGrey,
    paddingBottom: theme.spacing(2),
    zIndex: 10,
    top: '-4px',
  },
  titleSection: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hr: {
    marginLeft: 0,
    marginRight: 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    width: '100%',
  },
  sectionsContainer: {
    overFlowY: 'scroll',
  },
  tabs: {
    alignSelf: 'flex-start',
  },
}))
const Template = (args) => {
  const [scrollIndex, setScrollIndex] = useState(0)
  const currentMissionSection = useRef(null)
  const pastMissionsSection = useRef(null)
  const classes = useStyles()

  const setChange = (event, newValue) => {
    // eslint-disable-next-line no-undef
    window.scrollTo({
      left: 0,
      top:
        (newValue === 1
          ? pastMissionsSection.current.offsetTop
          : currentMissionSection.current.offsetTop) - 160,
      behavior: 'smooth',
    })
    setScrollIndex(newValue)
  }
  return (
    <div className={classes.pageContainer} data-test-id="missions-page">
      <div className={classes.headerSection}>
        <div className={classes.titleSection}>
          <div className={classes.title}>
            <SquadIcon
              viewBox="0 0 20 20"
              style={{ marginRight: '8px', color: '#9d4ba3' }}
            />
            <Typography variant="h4">Squads</Typography>
          </div>
          <IconButton>
            <CloseIcon className={classes.closeIcon} />
          </IconButton>
        </div>
        <hr className={classes.hr} />
        <Tabs
          value={scrollIndex}
          onChange={setChange}
          indicatorColor="primary"
          className={classes.tabs}
        >
          <Tab label="Your Squad" />
          <Tab label="Past Missions" />
        </Tabs>
      </div>

      <div className={classes.contentContainer}>
        <div
          ref={currentMissionSection}
          style={{ display: 'flex', width: '100%' }}
        >
          <CurrentMission {...args} />
        </div>
        <div
          ref={pastMissionsSection}
          style={{ width: '100%', marginTop: '16px' }}
        />
      </div>
    </div>
  )
}

export const notStarted = Template.bind({})
notStarted.args = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: null,
  },
}

export const noEmailInvitesYet = Template.bind({})
noEmailInvitesYet.args = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: {
      squadName: 'rando',
      started: null,
      completed: null,
      missionId: 'Ko94HuMdI',
      status: 'pending',
      tabGoal: 1000,
      tabCount: 0,
      squadMembers: [
        {
          username: 'alec',
          invitedEmail: null,
          status: 'accepted',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
      ],
      endOfMissionAwards: [],
    },
  },
}

export const pendingMission = Template.bind({})
pendingMission.args = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: {
      squadName: 'rando',
      started: null,
      completed: null,
      missionId: 'Ko94HuMdI',
      status: 'pending',
      tabGoal: 1000,
      tabCount: 0,
      squadMembers: [
        {
          username: 'alec',
          invitedEmail: null,
          status: 'accepted',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
        {
          username: null,
          invitedEmail: 'alectest@gmail.com',
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
      ],
      endOfMissionAwards: [],
    },
  },
}

export const inProgress = Template.bind({})
inProgress.args = {
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
      tabCount: 268,
      squadMembers: [
        {
          username: 'kevin',
          invitedEmail: null,
          status: 'accepted',
          tabs: 24,
          longestTabStreak: 4,
          currentTabStreak: 2,
          missionMaxTabsDay: 4,
          missionCurrentTabsDay: 4,
        },
        {
          username: 'alec',
          invitedEmail: null,
          status: 'accepted',
          tabs: 244,
          longestTabStreak: 4,
          currentTabStreak: 0,
          missionMaxTabsDay: 10,
          missionCurrentTabsDay: 10,
        },
        {
          username: null,
          invitedEmail: 'alec+897234@tabforacause.org',
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
        {
          username: null,
          invitedEmail: 'alec+1s@tabforacause.org',
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
        {
          username: 'sandra',
          invitedEmail: null,
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
      ],
      endOfMissionAwards: [],
    },
  },
}

export const completed = Template.bind({})
completed.args = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: {
      squadName: 'TestSquad',
      started: '2017-07-11T03:05:12Z',
      completed: '2017-07-15T03:05:12Z',
      missionId: '123456789',
      status: 'completed',
      tabGoal: 1000,
      tabCount: 1000,
      squadMembers: [
        {
          username: 'kevin',
          invitedEmail: null,
          status: 'accepted',
          tabs: 24,
          longestTabStreak: 4,
          currentTabStreak: 2,
          missionMaxTabsDay: 4,
          missionCurrentTabsDay: 4,
        },
        {
          username: 'alec',
          invitedEmail: null,
          status: 'accepted',
          tabs: 244,
          longestTabStreak: 4,
          currentTabStreak: 0,
          missionMaxTabsDay: 10,
          missionCurrentTabsDay: 10,
        },
        {
          username: null,
          invitedEmail: 'alec+897234@tabforacause.org',
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
        {
          username: null,
          invitedEmail: 'alec+1s@tabforacause.org',
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
        {
          username: 'sandra',
          invitedEmail: null,
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
      ],
      endOfMissionAwards: [
        { user: 'kevin', awardType: 'Consistent Kitty', unit: 6 },
        { user: 'kevin', awardType: 'Hot Paws', unit: 20 },
        { user: 'alec', awardType: 'All-Star Fur Ball', unit: 258 },
      ],
    },
  },
}

export const completedWithInvite = Template.bind({})
completedWithInvite.args = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    pendingMissionInvites: [
      { missionId: '123456789', invitingUser: { name: 'spooky ghost alec' } },
    ],
    currentMission: {
      squadName: 'TestSquad',
      started: '2017-07-11T03:05:12Z',
      completed: '2017-07-15T03:05:12Z',
      missionId: '123456789',
      status: 'completed',
      tabGoal: 1000,
      tabCount: 1000,
      squadMembers: [
        {
          username: 'kevin',
          invitedEmail: null,
          status: 'accepted',
          tabs: 24,
          longestTabStreak: 4,
          currentTabStreak: 2,
          missionMaxTabsDay: 4,
          missionCurrentTabsDay: 4,
        },
        {
          username: 'alec',
          invitedEmail: null,
          status: 'accepted',
          tabs: 244,
          longestTabStreak: 4,
          currentTabStreak: 0,
          missionMaxTabsDay: 10,
          missionCurrentTabsDay: 10,
        },
        {
          username: null,
          invitedEmail: 'alec+897234@tabforacause.org',
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
        {
          username: null,
          invitedEmail: 'alec+1s@tabforacause.org',
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
        {
          username: 'sandra',
          invitedEmail: null,
          status: 'pending',
          tabs: 0,
          longestTabStreak: 0,
          currentTabStreak: 0,
          missionMaxTabsDay: 0,
          missionCurrentTabsDay: 0,
        },
      ],
      endOfMissionAwards: [
        { user: 'kevin', awardType: 'Consistent Kitty', unit: 6 },
        { user: 'kevin', awardType: 'Hot Paws', unit: 20 },
        { user: 'alec', awardType: 'All-Star Fur Ball', unit: 258 },
      ],
    },
  },
}

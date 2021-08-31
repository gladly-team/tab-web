import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
    width: '100%',
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
    maxWidth: '1280px',
    marginTop: '24px',
    alignItems: 'center',
  },
}))
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.pageContainer}>
      <div className={classes.contentContainer}>
        <div style={{ display: 'flex', width: '100%' }}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <CurrentMission {...args} />
        </div>
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

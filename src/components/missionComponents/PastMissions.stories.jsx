import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PastMissions from './PastMissions'

export default {
  title: 'Views/Missions/PastMissions',
  component: PastMissions,
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
          <PastMissions {...args} />
        </div>
      </div>
    </div>
  )
}

export const NoPastMissions = Template.bind({})
NoPastMissions.args = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
    currentMission: { status: 'pending' },
    pastMissions: {
      edges: [],
    },
  },
}
NoPastMissions.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
}

export const completedOngoing = Template.bind({})
completedOngoing.args = {
  user: {
    username: 'alec',
    id: 'VXNlcjpjTDVLY0ZLSGQ5ZkVVNUM5VnN0ajNnNEpBYzcz',
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
            tabCount: 258,
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
                tabs: 234,
                longestTabStreak: 0,
                currentTabStreak: 0,
                missionMaxTabsDay: 4,
                missionCurrentTabsDay: 4,
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
        {
          node: {
            squadName: 'TestSquad',
            started: '2017-06-11T03:05:12Z',
            completed: '2017-06-19T07:05:12Z',
            missionId: '113456789',
            status: 'completed',
            tabGoal: 1000,
            tabCount: 258,
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
                tabs: 234,
                longestTabStreak: 0,
                currentTabStreak: 0,
                missionMaxTabsDay: 4,
                missionCurrentTabsDay: 4,
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
      ],
    },
    currentMission: { status: 'pending' },
  },
}
completedOngoing.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
}

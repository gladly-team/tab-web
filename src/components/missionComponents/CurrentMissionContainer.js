import { createFragmentContainer, graphql } from 'react-relay'
import CurrentMission from 'src/components/missionComponents/CurrentMission'

export default createFragmentContainer(CurrentMission, {
  user: graphql`
    fragment CurrentMissionContainer_user on User {
      username
      id
      currentMission {
        squadName
        started
        completed
        missionId
        status
        tabGoal
        tabCount
        squadMembers {
          username
          invitedEmail
          status
          tabs
          longestTabStreak
          currentTabStreak
          missionMaxTabsDay
          missionCurrentTabsDay
        }
        endOfMissionAwards {
          user
          awardType
          unit
        }
      }
      pendingMissionInvites {
        missionId
        invitingUser {
          name
        }
      }
    }
  `,
})

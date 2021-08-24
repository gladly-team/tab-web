import { createFragmentContainer, graphql } from 'react-relay'
import PastMissions from 'src/components/missionComponents/PastMissions'

export default createFragmentContainer(PastMissions, {
  user: graphql`
    fragment PastMissionsContainer_user on User {
      username
      id
      pastMissions {
        edges {
          node {
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
        }
      }
      currentMission {
        status
      }
    }
  `,
})

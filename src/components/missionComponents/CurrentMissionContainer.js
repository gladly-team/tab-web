import { createFragmentContainer, graphql } from 'react-relay'
import CurrentMission from 'src/components/missionComponents/CurrentMission'

export default createFragmentContainer(CurrentMission, {
  user: graphql`
    fragment CurrentMissionContainer_user on User {
      username
      id
      currentMission {
        squadName
        missionId
        status
        tabGoal
        tabCount
        squadMembers {
          username
          invitedEmail
          status
          tabs
        }
        endOfMissionAwards {
          user
          awardType
          unit
        }
      }
    }
  `,
})

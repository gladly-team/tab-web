import { createFragmentContainer, graphql } from 'react-relay'
import CurrentMission from 'src/components/MissionComponents/CurrentMission'

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

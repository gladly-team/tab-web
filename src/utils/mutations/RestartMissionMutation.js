import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation RestartMissionMutation($input: RestartMissionInput!) {
    restartMission(input: $input) {
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
  }
`

const RestartMissionMutation = (userId, missionId) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        missionId,
      },
    },
  })
export default RestartMissionMutation

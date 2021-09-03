import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SquadInviteResponseMutation($input: SquadInviteResponseInput!) {
    squadInviteResponse(input: $input) {
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

const SquadInviteResponseMutation = (userId, missionId, accepted) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        missionId,
        accepted,
      },
    },
  })

export default SquadInviteResponseMutation

import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation CreateSquadInvitesMutation($input: CreateSquadInvitesInput!) {
    createSquadInvites(input: $input) {
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

const CreateSquadInvitesMutation = (
  inviterId,
  invitedEmails,
  inviterName,
  inviterMessage
) =>
  callMutation({
    mutation,
    variables: {
      input: {
        inviterId,
        invitedEmails,
        inviterName,
        inviterMessage,
      },
    },
  })
export default CreateSquadInvitesMutation

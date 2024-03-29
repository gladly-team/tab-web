import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation CreateNewMissionMutation($input: CreateNewMissionInput!) {
    createNewMission(input: $input) {
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

const CreateNewMissionMutation = (userId, squadName) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        squadName,
      },
    },
  })
export default CreateNewMissionMutation

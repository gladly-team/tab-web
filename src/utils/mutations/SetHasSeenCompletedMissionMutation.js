import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetHasSeenCompletedMissionMutation(
    $input: SetHasSeenCompletedMissionInput!
  ) {
    setHasSeenCompletedMission(input: $input) {
      success
    }
  }
`

const SetHasSeenCompletedMissionMutation = (userId, missionId, action) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        missionId,
        action,
      },
    },
  })
export default SetHasSeenCompletedMissionMutation

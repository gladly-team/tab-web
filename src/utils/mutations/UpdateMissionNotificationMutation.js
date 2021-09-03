import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation UpdateMissionNotificationMutation(
    $input: UpdateMissionNotificationInput!
  ) {
    updateMissionNotification(input: $input) {
      success
    }
  }
`

const UpdateMissionNotificationMutation = (userId, missionId, action) =>
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
export default UpdateMissionNotificationMutation

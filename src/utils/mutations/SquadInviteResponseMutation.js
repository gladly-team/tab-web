import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SquadInviteResponseMutation($input: SquadInviteResponseInput!) {
    squadInviteResponse(input: $input) {
      success
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

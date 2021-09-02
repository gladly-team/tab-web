import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetHasSeenSquadsMutation($input: SetHasSeenSquadsInput!) {
    setHasSeenSquads(input: $input) {
      user {
        userId
        hasSeenSquads
      }
    }
  }
`

const SetHasSeenSquadsMutation = (userId) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
      },
    },
  })

export default SetHasSeenSquadsMutation

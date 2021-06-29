import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

// currently not using any of the return data in the ui, but will be source of truth
const mutation = graphql`
  mutation CreateInvitedUsersMutation($input: CreateInvitedUsersInput!) {
    createInvitedUsers(input: $input) {
      successfulEmailAddresses {
        email
      }
      failedEmailAddresses {
        email
        error
      }
    }
  }
`

const CreateInvitedUsersMutation = (
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
export default CreateInvitedUsersMutation

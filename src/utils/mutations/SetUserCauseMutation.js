import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetUserCauseMutation($input: SetUserCauseInput!) {
    setUserCause(input: $input) {
      user {
        id
        cause {
          causeId
          name
          individualImpactEnabled
          # Theme data is required for CustomThemeHOC.
          theme {
            primaryColor
            secondaryColor
          }
        }
        ...UserBackgroundImageContainer_user
        ...UserImpactContainer_user
        ...InviteFriendsIconContainer_user
        ...SocialShareContainer_user
        ...EmailInviteDialogContainer_user
      }
    }
  }
`

const SetUserCauseMutation = ({ causeId, userId }) =>
  callMutation({
    mutation,
    variables: {
      input: {
        causeId,
        userId,
      },
    },
  })

export default SetUserCauseMutation

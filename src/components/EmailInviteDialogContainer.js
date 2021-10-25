import { createFragmentContainer, graphql } from 'react-relay'
import EmailInviteDialog from './EmailInviteDialog'

export default createFragmentContainer(EmailInviteDialog, {
  user: graphql`
    fragment EmailInviteDialogContainer_user on User {
      cause {
        sharing {
          title
          subtitle
          imgCategory
        }
      }
      ...SocialShareContainer_user
    }
  `,
})

import { createFragmentContainer, graphql } from 'react-relay'
import InviteFriendsIcon from 'src/components/InviteFriendsIcon'

export default createFragmentContainer(InviteFriendsIcon, {
  user: graphql`
    fragment InviteFriendsIconContainer_user on User {
      numUsersRecruited
      username
      id
      cause {
        landingPagePath
      }
    }
  `,
})

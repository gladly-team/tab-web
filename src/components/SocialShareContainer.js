import { createFragmentContainer, graphql } from 'react-relay'
import SocialShare from 'src/components/SocialShare'

export default createFragmentContainer(SocialShare, {
  user: graphql`
    fragment SocialShareContainer_user on User {
      cause {
        sharing {
          redditButtonTitle
          facebookButtonTitle
          twitterButtonTitle
          tumblrTitle
          tumblrCaption
        }
      }
    }
  `,
})

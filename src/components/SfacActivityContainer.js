import { createFragmentContainer, graphql } from 'react-relay'
import SfacActivity from 'src/components/SfacActivity'

export default createFragmentContainer(SfacActivity, {
  user: graphql`
    fragment SfacActivityContainer_user on User {
      cause {
        name
      }
      searches
      searchesToday
      sfacActivityState
    }
  `,
})

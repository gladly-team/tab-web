import { createFragmentContainer, graphql } from 'react-relay'
import UserBackgroundImage from 'src/components/UserBackgroundImage'

export default createFragmentContainer(UserBackgroundImage, {
  user: graphql`
    fragment UserBackgroundImageContainer_user on User {
      id
      backgroundImage {
        imageURL
        timestamp
      }
    }
  `,
})

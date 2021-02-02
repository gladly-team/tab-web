import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetBackgroundDailyImageMutation($input: SetUserBkgDailyImageInput!) {
    setUserBkgDailyImage(input: $input) {
      user {
        backgroundImage {
          imageURL
          timestamp
        }
      }
    }
  }
`
const SetBackgroundDailyImageMutation = (userId) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        // currently this only fires when background image feature flag is enabled
        category: 'cats',
      },
    },
  })
export default SetBackgroundDailyImageMutation

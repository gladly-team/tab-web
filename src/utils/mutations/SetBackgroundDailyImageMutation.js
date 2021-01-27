import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetBackgroundDailyImageMutation($input: SetUserBkgDailyImageInput!) {
    setUserBkgDailyImage(input: $input) {
      user {
        backgroundOption
        backgroundImage {
          id
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
      },
    },
  })
export default SetBackgroundDailyImageMutation

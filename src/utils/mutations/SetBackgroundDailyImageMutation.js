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
const SetBackgroundDailyImageMutation = async (userId) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
      },
    },
  })
export default SetBackgroundDailyImageMutation

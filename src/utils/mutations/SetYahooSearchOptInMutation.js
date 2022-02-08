import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

// todo: @jedtan, edit returned field after completing TFAC-781
const mutation = graphql`
  mutation SetYahooSearchOptInMutation($input: SetYahooSearchOptInInput!) {
    setYahooSearchOptIn(input: $input) {
      user {
        userId
      }
    }
  }
`

const SetYahooSearchOptInMutation = (userId, optIn) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        optIn,
      },
    },
  })
export default SetYahooSearchOptInMutation

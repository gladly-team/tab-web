import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetYahooSearchOptInMutation($input: SetYahooSearchOptInInput!) {
    setYahooSearchOptIn(input: $input) {
      user {
        userId
        yahooPaidSearchRewardOptIn
        showYahooPrompt
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

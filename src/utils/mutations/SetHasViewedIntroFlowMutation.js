import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetHasViewedIntroFlowMutation($input: SetHasViewedIntroFlowInput!) {
    setHasViewedIntroFlow(input: $input) {
      user {
        hasViewedIntroFlow
      }
    }
  }
`

const SetHasViewedIntroFlowMutation = ({ enabled, userId }) =>
  callMutation({
    mutation,
    variables: {
      input: {
        enabled,
        userId,
      },
    },
  })

export default SetHasViewedIntroFlowMutation

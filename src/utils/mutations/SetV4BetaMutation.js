import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetV4BetaMutation($input: SetV4BetaInput!) {
    setV4Beta(input: $input) {
      user {
        v4BetaEnabled
      }
    }
  }
`

const SetV4BetaMutation = ({ enabled, userId }) => {
  return callMutation({
    mutation,
    variables: {
      input: {
        enabled,
        userId,
      },
    },
  })
}

export default SetV4BetaMutation

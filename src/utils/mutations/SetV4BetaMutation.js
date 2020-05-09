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

// TODO: add tests

export default ({ enabled, userId }) => {
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

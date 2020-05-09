import { graphql } from 'react-relay'
import createMutation from 'src/utils/mutations/createMutation'

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
  return createMutation({
    mutation,
    variables: {
      input: {
        enabled,
        userId,
      },
    },
  })
}

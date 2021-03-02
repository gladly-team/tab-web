import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation LogUserRevenueMutation($input: LogUserRevenueInput!) {
    logUserRevenue(input: $input) {
      success
    }
  }
`

const LogUserRevenueMutation = (input) =>
  callMutation({
    mutation,
    variables: {
      input,
    },
  })

export default LogUserRevenueMutation

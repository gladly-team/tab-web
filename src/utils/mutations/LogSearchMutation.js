import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation LogSearchMutation($input: LogSearchInput!) {
    logSearch(input: $input) {
      user {
        id
        heartsUntilNextLevel
        level
        searches
        searchRateLimit {
          limitReached
          reason
        }
        searchesToday
        vcCurrent
        vcAllTime
      }
    }
  }
`

const LogSearchMutation = (input) => {
  callMutation({
    mutation,
    variables: {
      input,
    },
  })
}

export default LogSearchMutation

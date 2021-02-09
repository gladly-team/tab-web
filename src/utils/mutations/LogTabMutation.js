import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

// currently not using any of the return data, but will be source of truth for tab counts
const mutation = graphql`
  mutation LogTabMutation($input: LogTabInput!) {
    logTab(input: $input) {
      user {
        id
        tabs
        tabsToday
      }
    }
  }
`

const LogTabMutation = (userId, tabId) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        tabId,
      },
    },
  })
export default LogTabMutation

import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation LogTabMutation($input: LogTabInput!) {
    logTab(input: $input) {
      user {
        id
        tabs
        tabsToday
        vcCurrent
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

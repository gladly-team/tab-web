import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation CreateSearchEnginePromptLogMutation(
    $input: CreateSearchEnginePromptLogInput!
  ) {
    createSearchEnginePromptLog(input: $input) {
      user {
        showYahooPrompt
      }
    }
  }
`

const CreateSearchEnginePromptLogMutation = (
  userId,
  searchEnginePrompted,
  switched
) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        searchEnginePrompted,
        switched,
      },
    },
  })
export default CreateSearchEnginePromptLogMutation

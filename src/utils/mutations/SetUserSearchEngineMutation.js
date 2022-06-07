import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation SetUserSearchEngineMutation($input: SetUserSearchEngineInput!) {
    setUserSearchEngine(input: $input) {
      user {
        userId
        searchEngine {
          engineId
          name
          searchUrlPersonalized
          rank
          isCharitable
          inputPrompt
        }
      }
    }
  }
`

const SetUserSearchEngineMutation = (userId, searchEngine) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        searchEngine,
      },
    },
  })
export default SetUserSearchEngineMutation

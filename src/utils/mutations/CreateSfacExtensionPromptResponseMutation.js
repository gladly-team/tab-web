import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation CreateSfacExtensionPromptResponseMutation(
    $input: CreateSfacExtensionPromptResponseInput!
  ) {
    createSfacExtensionPromptResponse(input: $input) {
      user {
        showSfacExtensionPrompt
      }
    }
  }
`

const CreateSfacExtensionPromptResponseMutation = (userId, browser, accepted) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        browser,
        accepted,
      },
    },
  })
export default CreateSfacExtensionPromptResponseMutation

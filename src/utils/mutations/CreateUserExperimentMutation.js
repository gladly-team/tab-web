import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation CreateUserExperimentMutation($input: CreateUserExperimentInput!) {
    createUserExperiment(input: $input) {
      success
    }
  }
`

const CreateUserExperimentMutation = ({
  userId,
  experimentId,
  variationId,
  variationValueStr,
}) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        experimentId,
        variationId,
        variationValueStr,
      },
    },
  })

export default CreateUserExperimentMutation

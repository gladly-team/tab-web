import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

const mutation = graphql`
  mutation CreateUserExperimentMutation($input: CreateUserExperimentInput!) {
    createUserExperiment(input: $input) {
      UserExperiment {
        userId
        experimentId
        variationId
      }
    }
  }
`

const CreateUserExperimentMutation = ({ userId, experimentId, variationId }) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        experimentId,
        variationId,
      },
    },
  })

export default CreateUserExperimentMutation

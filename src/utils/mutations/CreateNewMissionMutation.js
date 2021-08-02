import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

// currently not using any of the return data, but will be source of truth for tab counts
const mutation = graphql`
  mutation CreateNewMissionMutation($input: CreateNewMissionInput!) {
    createNewMission(input: $input) {
      squadId
    }
  }
`

const CreateNewMissionMutation = (userId, squadName) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        squadName,
      },
    },
  })
export default CreateNewMissionMutation

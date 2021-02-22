import { graphql } from 'react-relay'
import callMutation from 'src/utils/mutations/callMutation'

// currently not using any of the return data, but will be source of truth for tab counts
const mutation = graphql`
  mutation UpdateImpactMutation($input: UpdateImpactInput!) {
    updateImpact(input: $input) {
      userImpact {
        visitsUntilNextImpact
        pendingUserReferralImpact
        userImpactMetric
        confirmedImpact
      }
    }
  }
`

const UpdateImpactMutation = (
  userId,
  charityId
  // { logImpact, claimPendingReferralImpact, confirmImpact }
) =>
  callMutation({
    mutation,
    variables: {
      input: {
        userId,
        charityId,
        // logImpact,
        // claimPendingReferralImpact,
        // confirmImpact,
      },
    },
  })
export default UpdateImpactMutation

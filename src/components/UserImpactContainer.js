import { createFragmentContainer, graphql } from 'react-relay'
import UserImpact from 'src/components/UserImpact'

export default createFragmentContainer(UserImpact, {
  userImpact: graphql`
    fragment UserImpactContainer_userImpact on UserImpact {
      visitsUntilNextImpact
      pendingUserReferralImpact
      userImpactMetric
      confirmedImpact
    }
  `,
})

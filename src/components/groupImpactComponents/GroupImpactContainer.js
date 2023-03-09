import { createFragmentContainer, graphql } from 'react-relay'
import GroupImpact from 'src/components/groupImpactComponents/GroupImpact'

export default createFragmentContainer(GroupImpact, {
  user: graphql`
    fragment GroupImpactContainer_user on User {
      cause {
        groupImpactMetric {
          id
          dollarProgress
          dollarGoal
          impactMetric {
            impactTitle
            whyValuableDescription
          }
        }
      }
      sfacActivityState
    }
  `,
})

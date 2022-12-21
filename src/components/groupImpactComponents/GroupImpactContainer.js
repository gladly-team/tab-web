import { createFragmentContainer, graphql } from 'react-relay'
import GroupImpact from 'src/components/groupImpactComponents/GroupImpact'

export default createFragmentContainer(GroupImpact, {
  user: graphql`
    fragment GroupImpactContainer_cause on Cause {
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
  `,
})

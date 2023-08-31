import { createFragmentContainer, graphql } from 'react-relay'
import GroupImpact from 'src/components/groupImpactComponents/GroupImpact'

export default createFragmentContainer(GroupImpact, {
  user: graphql`
    fragment GroupImpactContainer_user on User {
      id
      cause {
        groupImpactMetric {
          id
          dollarProgress
          dollarProgressFromSearch
          dollarGoal
          impactMetric {
            impactTitle
            whyValuableDescription
            impactCountPerMetric
          }
        }
        groupImpactMetricCount
      }
      sfacActivityState
      leaderboard {
        position
        user {
          username
          id
        }
        userGroupImpactMetric {
          userId
          dollarContribution
          tabDollarContribution
          searchDollarContribution
          shopDollarContribution
          referralDollarContribution
        }
      }
    }
  `,
})

import { createFragmentContainer, graphql } from 'react-relay'
import UserImpact from 'src/components/UserImpact'

export default createFragmentContainer(UserImpact, {
  userImpact: graphql`
    fragment UserImpactContainer_userImpact on UserImpact {
      visitsUntilNextImpact
      pendingUserReferralImpact
      userImpactMetric
      confirmedImpact
      hasClaimedLatestReward
      pendingUserReferralCount
    }
  `,
  user: graphql`
    fragment UserImpactContainer_user on User {
      username
      id
      notifications {
        code
      }
      currentMission {
        acknowledgedMissionComplete
        acknowledgedMissionStarted
        status
        missionId
      }
      pendingMissionInvites {
        missionId
        invitingUser {
          userId
          name
        }
      }
      hasSeenSquads
    }
  `,
})

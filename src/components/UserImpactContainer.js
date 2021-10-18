import { createFragmentContainer, graphql } from 'react-relay'
import UserImpactSwitchComponent from 'src/components/UserImpactSwitchComponent'

export default createFragmentContainer(UserImpactSwitchComponent, {
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
      email
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
          name
        }
      }
      cause {
        landingPagePath
        impactVisits
        theme {
          primaryColor
          secondaryColor
        }
        impact {
          impactCounterText
          referralRewardTitle
          referralRewardSubtitle
          claimImpactTitle
          claimImpactSubtitle
          newlyReferredTitle
          impactWalkthroughText
          confirmImpactText
        }
      }
      hasSeenSquads
    }
  `,
})

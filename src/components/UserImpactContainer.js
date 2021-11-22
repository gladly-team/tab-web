import { createFragmentContainer, graphql } from 'react-relay'
import UserImpact from 'src/components/UserImpact'

export default createFragmentContainer(UserImpact, {
  user: graphql`
    fragment UserImpactContainer_user on User {
      username
      id
      email
      notifications {
        code
      }
      userImpact {
        visitsUntilNextImpact
        pendingUserReferralImpact
        userImpactMetric
        confirmedImpact
        hasClaimedLatestReward
        pendingUserReferralCount
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
          claimImpactSubtitle
          referralRewardNotification
          impactIcon
          walkMeGif
          referralRewardTitle
          referralRewardSubtitle
          newlyReferredImpactWalkthroughText
          impactWalkthroughText
          confirmImpactSubtitle
        }
      }
      hasSeenSquads
      ...EmailInviteDialogContainer_user
      ...SocialShareContainer_user
    }
  `,
})

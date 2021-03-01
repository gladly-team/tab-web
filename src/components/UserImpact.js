import React, { useState } from 'react'
import PropTypes from 'prop-types'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import { CAT_CHARITY } from 'src/utils/constants'
import Notification from 'src/components/Notification'
import ImpactDialog from 'src/components/ImpactDialog'
import ImpactCounter from 'src/components/ImpactCounter'
import { Typography } from '@material-ui/core'

const UserImpact = ({ userImpact, userId }) => {
  const {
    confirmedImpact,
    hasClaimedLatestReward,
    visitsUntilNextImpact,
    userImpactMetric,
    pendingUserReferralImpact,
    pendingUserReferralCount,
  } = userImpact
  const showReward = confirmedImpact && !hasClaimedLatestReward
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(!confirmedImpact)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [rewardNotificationOpen, setRewardNotification] = useState(showReward)
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [
    referralRewardNotificationOpen,
    setReferralRewardNotification,
  ] = useState(pendingUserReferralImpact > 0)
  const [referralRewardDialogOpen, setReferralRewardDialogOpen] = useState(
    false
  )
  const handleConfirmDialogClose = () => {
    UpdateImpactMutation(userId, CAT_CHARITY, { confirmImpact: true })
    setConfirmDialogOpen(false)
    setAlertDialogOpen(true)
  }
  const handleAlertDialogClose = () => setAlertDialogOpen(false)
  const handleClaimReward = () => {
    UpdateImpactMutation(userId, CAT_CHARITY, { claimLatestReward: true })
    setRewardDialogOpen(true)
    setRewardNotification(false)
  }
  const handleRewardDialogClose = () => setRewardDialogOpen(false)

  const handleClaimReferralNotification = async () => {
    UpdateImpactMutation(userId, CAT_CHARITY, {
      claimPendingUserReferralImpact: true,
    })
    setReferralRewardNotification(false)
    setReferralRewardDialogOpen(true)
  }
  const handleReferralRewardDialogClose = () =>
    setReferralRewardDialogOpen(false)
  return (
    <div>
      <ImpactCounter
        includeNumber
        number={userImpactMetric}
        progress={(1 - visitsUntilNextImpact / 14) * 100}
      />
      <ImpactDialog
        modalType="confirmImpact"
        open={confirmDialogOpen}
        buttonOnClick={handleConfirmDialogClose}
      />
      <ImpactDialog
        modalType="impactWalkMe"
        open={alertDialogOpen}
        onClose={handleAlertDialogClose}
      />
      <ImpactDialog
        modalType="claimImpactReward"
        open={rewardDialogOpen}
        buttonOnClick={handleRewardDialogClose}
      />
      <ImpactDialog
        modalType="claimReferralReward"
        open={referralRewardDialogOpen}
        buttonOnClick={handleReferralRewardDialogClose}
        referralImpact={pendingUserReferralImpact}
      />
      {rewardNotificationOpen && (
        <Notification
          text={
            <Typography>
              You did it! You just turned your tab into a treat for a cat. Keep
              it up, and do good with every new tab!"
            </Typography>
          }
          buttonText="Hooray"
          buttonOnClick={handleClaimReward}
        />
      )}
      {referralRewardNotificationOpen && (
        <Notification
          text={
            <Typography>
              congrats! You recruited{' '}
              <span style={{ fontWeight: 'bold' }}>
                {`${pendingUserReferralCount} friend${
                  pendingUserReferralCount > 1 ? 's' : ''
                } `}
              </span>
              to help shelter cats just by opening tabs. To celebrate, we'll
              give a treat to an extra {pendingUserReferralImpact} cats.
            </Typography>
          }
          buttonText="Claim"
          buttonOnClick={handleClaimReferralNotification}
        />
      )}
    </div>
  )
}

UserImpact.displayName = 'UserImpact'
UserImpact.propTypes = {
  userImpact: PropTypes.shape({
    visitsUntilNextImpact: PropTypes.number.isRequired,
    pendingUserReferralImpact: PropTypes.number.isRequired,
    pendingUserReferralCount: PropTypes.number.isRequired,
    userImpactMetric: PropTypes.number.isRequired,
    confirmedImpact: PropTypes.bool.isRequired,
    hasClaimedLatestReward: PropTypes.bool.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/require-default-props
  userId: PropTypes.string,
}

export default UserImpact

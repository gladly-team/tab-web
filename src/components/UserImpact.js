import React, { useState } from 'react'
import PropTypes from 'prop-types'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import { CAT_CHARITY } from 'src/utils/constants'
import Notification from 'src/components/Notification'
import ImpactDialog from 'src/components/ImpactDialog'

const UserImpact = ({ userImpact, userId }) => {
  const {
    confirmedImpact,
    hasClaimedLatestReward,
    userImpactMetric,
  } = userImpact
  const showReward = confirmedImpact && !hasClaimedLatestReward
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(!confirmedImpact)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [rewardNotificationOpen, setRewardNotification] = useState(showReward)
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const handleConfirmDialogClose = () => {
    UpdateImpactMutation(userId, CAT_CHARITY, { confirmImpact: true })
    setConfirmDialogOpen(false)
    setAlertDialogOpen(true)
  }
  const handleAlertDialogClose = () => {
    setAlertDialogOpen(false)
  }
  const handleClaimReward = () => {
    UpdateImpactMutation(userId, CAT_CHARITY, { claimLatestReward: true })
    setRewardDialogOpen(true)
    setRewardNotification(false)
  }
  const handleRewardDialogClose = () => {
    setRewardDialogOpen(false)
  }
  return (
    <div>
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
      <span>{userImpactMetric}</span>
      {rewardNotificationOpen && (
        <Notification buttonOnClick={handleClaimReward} />
      )}
    </div>
  )
}

UserImpact.displayName = 'UserImpact'
UserImpact.propTypes = {
  userImpact: PropTypes.shape({
    visitsUntilNextImpact: PropTypes.number.isRequired,
    pendingUserReferralImpact: PropTypes.number.isRequired,
    userImpactMetric: PropTypes.number.isRequired,
    confirmedImpact: PropTypes.bool.isRequired,
    hasClaimedLatestReward: PropTypes.bool.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/require-default-props
  userId: PropTypes.string,
}

export default UserImpact

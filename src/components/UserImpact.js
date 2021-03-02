import React, { useState } from 'react'
import PropTypes from 'prop-types'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import { CAT_CHARITY } from 'src/utils/constants'
import Notification from 'src/components/Notification'
import ImpactCounter from 'src/components/ImpactCounter'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import dynamic from 'next/dynamic'

const ImpactDialog = dynamic(() => import('src/components/ImpactDialog'), {
  ssr: false,
})

const useStyles = makeStyles(() => ({
  impactCounter: { backgroundColor: '#fff', marginRight: '15px' },
}))
const UserImpact = ({ userImpact, userId, user }) => {
  const {
    confirmedImpact,
    hasClaimedLatestReward,
    visitsUntilNextImpact,
    userImpactMetric,
    pendingUserReferralImpact,
    pendingUserReferralCount,
  } = userImpact
  const showReward = confirmedImpact && !hasClaimedLatestReward
  const referralRewardNotificationOpen = pendingUserReferralImpact > 0
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(!confirmedImpact)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
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
  }
  const handleRewardDialogClose = () => setRewardDialogOpen(false)

  const handleClaimReferralNotification = async () => {
    setReferralRewardDialogOpen(true)
  }
  const handleReferralRewardDialogClose = () => {
    setReferralRewardDialogOpen(false)
    UpdateImpactMutation(userId, CAT_CHARITY, {
      claimPendingUserReferralImpact: true,
    })
  }
  const classes = useStyles()
  return (
    <div>
      <ImpactCounter
        includeNumber
        className={classes.impactCounter}
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
        user={user}
      />
      <ImpactDialog
        modalType="claimReferralReward"
        open={referralRewardDialogOpen}
        buttonOnClick={handleReferralRewardDialogClose}
        referralImpact={pendingUserReferralImpact}
        user={user}
      />
      {showReward && (
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
  userId: PropTypes.string,
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
}

UserImpact.defaultProps = {
  user: {},
  userId: '',
}
export default UserImpact

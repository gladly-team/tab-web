import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import {
  CAT_CHARITY,
  CAT_IMPACT_VISITS,
  INTL_CAT_DAY_2021_NOTIFICATION,
} from 'src/utils/constants'
import Notification from 'src/components/Notification'
import ImpactCounter from 'src/components/ImpactCounter'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import dynamic from 'next/dynamic'
import { isPlural } from 'src/utils/formatting'
import confetti from 'canvas-confetti'
import usePrevious from 'src/utils/hooks/usePrevious'
import EmailInviteDialog from 'src/components/EmailInviteDialog'
import Dialog from '@material-ui/core/Dialog'
import { get } from 'lodash/object'
import localStorageMgr from 'src/utils/localstorage-mgr'
import Link from 'src/components/Link'

const ImpactDialog = dynamic(() => import('src/components/ImpactDialog'), {
  ssr: false,
})

const useStyles = makeStyles((theme) => ({
  impactCounter: { backgroundColor: '#fff', marginRight: '15px' },
  rootModal: { zIndex: '10000000 !important', borderRadius: '5px' },
  canvas: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: '90000',
    pointerEvents: 'none',
  },
  link: {
    display: 'inline',
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}))
const UserImpact = ({ userImpact, user }) => {
  const {
    confirmedImpact,
    hasClaimedLatestReward,
    visitsUntilNextImpact,
    userImpactMetric,
    pendingUserReferralImpact,
    pendingUserReferralCount,
  } = userImpact
  const userId = user.id
  const showReward = confirmedImpact && !hasClaimedLatestReward

  const referralRewardNotificationOpen =
    pendingUserReferralImpact > 0 && pendingUserReferralCount > 0
  const prevVisitsUntilNextImpact = usePrevious(visitsUntilNextImpact)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(!confirmedImpact)
  const [newlyReferredDialogOpen, setNewlyReferredDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [referralRewardDialogOpen, setReferralRewardDialogOpen] = useState(
    false
  )
  const [claimedReferralImpact, setClaimedReferralImpact] = useState(0)
  const [IntlCatDayNotification, setIntlCatDayNotification] = useState(false)
  const confettiCanvasRef = useRef(null)
  const confettiFunc = () => {
    const myConfetti = confetti.create(confettiCanvasRef.current, {
      resize: true,
    })
    const count = 200
    const defaults = {
      origin: { y: 0.51, x: 0.9 },
      angle: 140,
    }

    const fire = (particleRatio, opts) =>
      myConfetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }
  useEffect(() => {
    const internationalCatDay =
      get(user, 'notifications[0].code', false) === 'intlCatDay2021'
    const hasDismissedCatDayNotification =
      localStorageMgr.getItem(INTL_CAT_DAY_2021_NOTIFICATION) === 'true'
    if (internationalCatDay && !hasDismissedCatDayNotification) {
      setIntlCatDayNotification(true)
    }
  }, [user])
  useEffect(() => {
    if (
      visitsUntilNextImpact === CAT_IMPACT_VISITS &&
      prevVisitsUntilNextImpact === 1
    ) {
      confettiFunc()
    }
  }, [visitsUntilNextImpact, prevVisitsUntilNextImpact])
  const handleConfirmDialogClose = async () => {
    setConfirmDialogOpen(false)
    if (pendingUserReferralImpact) {
      setNewlyReferredDialogOpen(true)
    } else {
      setAlertDialogOpen(true)
    }
    await UpdateImpactMutation(userId, CAT_CHARITY, {
      confirmImpact: true,
      claimPendingUserReferralImpact: pendingUserReferralImpact
        ? true
        : undefined,
      claimLatestReward: pendingUserReferralImpact ? true : undefined,
    })
  }
  const handleNewlyReferredDialogOpen = () => {
    setNewlyReferredDialogOpen((prev) => !prev)
  }
  const handleAlertDialogClose = () => setAlertDialogOpen(false)
  const handleClaimReward = async () => {
    setRewardDialogOpen(true)
    await UpdateImpactMutation(userId, CAT_CHARITY, { claimLatestReward: true })
  }
  const handleRewardDialogClose = () => setRewardDialogOpen(false)

  const handleClaimReferralNotification = () => {
    setClaimedReferralImpact(pendingUserReferralImpact)
    setReferralRewardDialogOpen(true)
    UpdateImpactMutation(userId, CAT_CHARITY, {
      claimPendingUserReferralImpact: true,
    })
  }
  const handleReferralRewardDialogClose = async () => {
    setReferralRewardDialogOpen(false)
  }
  const dismissCatDayNotification = () => {
    localStorageMgr.setItem(INTL_CAT_DAY_2021_NOTIFICATION, 'true')
    setIntlCatDayNotification(false)
  }
  const classes = useStyles()
  return (
    <div>
      {visitsUntilNextImpact === CAT_IMPACT_VISITS ? (
        <canvas
          id="confettiCanvas"
          width="400"
          height="300"
          className={classes.canvas}
          ref={confettiCanvasRef}
        />
      ) : null}
      <ImpactCounter
        includeNumber
        className={classes.impactCounter}
        number={userImpactMetric}
        progress={
          // eslint-disable-next-line prettier/prettier

          // if user achieves a new milestone show the progress bar as full
          visitsUntilNextImpact === CAT_IMPACT_VISITS
            ? 100
            : (1 - visitsUntilNextImpact / CAT_IMPACT_VISITS) * 100
        }
      />
      <ImpactDialog
        modalType="confirmImpact"
        open={confirmDialogOpen}
        buttonOnClick={handleConfirmDialogClose}
      />
      <ImpactDialog
        modalType="newlyReferredImpactWalkMe"
        open={newlyReferredDialogOpen}
        onClose={handleNewlyReferredDialogOpen}
      />
      <ImpactDialog
        modalType="impactWalkMe"
        open={alertDialogOpen}
        onClose={handleAlertDialogClose}
      />
      <Dialog
        maxWidth="sm"
        classes={{ paperWidthSm: classes.customMaxWidthDialog }}
        fullWidth
        onClose={handleRewardDialogClose}
        aria-labelledby="customized-dialog-title"
        open={rewardDialogOpen}
        className={classes.rootModal}
      >
        <EmailInviteDialog
          username={user.username}
          userId={user.id}
          closeFunction={handleRewardDialogClose}
        />
      </Dialog>
      <ImpactDialog
        modalType="claimReferralReward"
        open={referralRewardDialogOpen}
        buttonOnClick={handleReferralRewardDialogClose}
        referralImpact={claimedReferralImpact}
        user={user}
      />
      {showReward && (
        <Notification
          text={
            <Typography gutterBottom>
              You did it! You just turned your tab into a treat for a cat. Keep
              it up, and do good with every new tab!
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
              Congrats! You recruited{' '}
              <span style={{ fontWeight: 'bold' }}>
                {`${pendingUserReferralCount} friend${isPlural(
                  pendingUserReferralCount
                )} `}
              </span>
              to help shelter cats just by opening tabs. To celebrate, we'll
              give a treat to an extra {pendingUserReferralImpact} cat
              {isPlural(pendingUserReferralImpact)}.
            </Typography>
          }
          buttonText="Claim"
          buttonOnClick={handleClaimReferralNotification}
        />
      )}
      {IntlCatDayNotification && (
        <Notification
          text={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'space-between',
              }}
            >
              <Typography
                variant="h6"
                align="center"
                style={{ marginBottom: '16px' }}
              >
                Help us celebrate International Cat Day (August 8)!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Invite your friends to try Tab for Cats, and we will give an
                extra dollar to{' '}
                <Link
                  target="_blank"
                  to="https://greatergood.org/jackson-galaxy"
                  className={classes.link}
                >
                  The Jackson Galaxy Project
                </Link>{' '}
                for every new user that joins August 3 - 10.
              </Typography>
              <Typography variant="body2">
                Participate in our photo challenge for the chance to be featured
                on Tab for Cats and win $100 for the charity of your choice.
                Contest details can be found{' '}
                <Link
                  target="_blank"
                  to="https://www.instagram.com/tabforacause"
                  className={classes.link}
                >
                  @tabforacause
                </Link>{' '}
                on Instagram and Facebook.
              </Typography>
            </div>
          }
          buttonText="Ok!"
          buttonOnClick={dismissCatDayNotification}
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
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    notifications: PropTypes.arrayOf(
      PropTypes.shape({ code: PropTypes.string })
    ),
  }).isRequired,
}

UserImpact.defaultProps = {}
export default UserImpact

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import SetHasSeenSquadsMutation from 'src/utils/mutations/SetHasSeenSquadsMutation'
import {
  CAT_CHARITY,
  CAT_IMPACT_VISITS,
  INTL_CAT_DAY_END_2021_NOTIFICATION,
} from 'src/utils/constants'
import { showDevelopmentOnlyMissionsFeature } from 'src/utils/featureFlags'
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
import MissionNotification from 'src/components/MissionNotification'
import { missionHubURL } from 'src/utils/urls'

const ImpactDialog = dynamic(() => import('src/components/ImpactDialog'), {
  ssr: false,
})

const useStyles = makeStyles((theme) => ({
  impactCounter: { backgroundColor: '#fff', marginRight: '15px' },
  rootModal: { zIndex: '10000000 !important', borderRadius: '5px' },
  bold: { fontWeight: 'bold' },
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
const UserImpact = ({ userImpact, user, disabled }) => {
  const {
    confirmedImpact,
    hasClaimedLatestReward,
    visitsUntilNextImpact,
    userImpactMetric,
    pendingUserReferralImpact,
    pendingUserReferralCount,
  } = userImpact
  const { currentMission, pendingMissionInvites, hasSeenSquads, email } = user
  const userId = user.id
  const showReward = confirmedImpact && !hasClaimedLatestReward
  const showSquadsIntroNotification =
    showDevelopmentOnlyMissionsFeature(email) &&
    !hasSeenSquads &&
    userImpactMetric >= 2
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
  const [
    showIntlCatDayEndNotification,
    setIntlCatDayEndNotification,
  ] = useState(false)
  const router = useRouter()
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
      get(user, 'notifications[0].code', false) === 'intlCatDayEnd2021'
    const hasDismissedCatDayNotification =
      localStorageMgr.getItem(INTL_CAT_DAY_END_2021_NOTIFICATION) === 'true'
    if (internationalCatDay && !hasDismissedCatDayNotification) {
      setIntlCatDayEndNotification(true)
    } else {
      setIntlCatDayEndNotification(false)
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
    localStorageMgr.setItem(INTL_CAT_DAY_END_2021_NOTIFICATION, 'true')
    setIntlCatDayEndNotification(false)
  }
  const handleIntroducingSquads = (e) => {
    e.preventDefault()
    router.push(missionHubURL)
    SetHasSeenSquadsMutation(userId)
  }
  const handleIntroducingSquadsClose = () => {
    SetHasSeenSquadsMutation(userId)
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
        disabled={disabled}
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
      {showIntlCatDayEndNotification && (
        <Notification
          text={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'space-between',
              }}
            >
              <Typography variant="body2" gutterBottom>
                Thank you to everyone who purr-ticipated in our International
                Cat Day celebration! Thanks to all of you, we were able to
                donate an extra $614 to The Jackson Galaxy Project.
              </Typography>
              <Typography variant="body2">
                Need an extra dose of cuteness?{' '}
                <Link
                  target="_blank"
                  to="https://www.instagram.com/p/CSo9-_tHquS/"
                  className={classes.link}
                >
                  Check out our top 10 submissions
                </Link>{' '}
                from our #tabforcatsday photo challenge!
              </Typography>
            </div>
          }
          buttonText="Ok!"
          buttonOnClick={dismissCatDayNotification}
        />
      )}
      {showSquadsIntroNotification && (
        <Notification
          text={
            <div>
              <Typography variant="body2" className={classes.bold} gutterBottom>
                Introducing Squads!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Start a mission with your friends and work together to help get
                a shelter cat adopted! When you work together with your squad
                you can make a larger impact, sooner.
              </Typography>
            </div>
          }
          buttonText="Create A Squad"
          buttonOnClick={handleIntroducingSquads}
          onClose={handleIntroducingSquadsClose}
          includeClose
        />
      )}
      <MissionNotification
        userId={userId}
        pendingMissionInvites={pendingMissionInvites}
        currentMission={currentMission}
      />
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
    currentMission: PropTypes.shape({
      missionId: PropTypes.string,
    }),
    pendingMissionInvites: PropTypes.arrayOf(
      PropTypes.shape({
        invitingUser: PropTypes.shape({ name: PropTypes.string }),
        missionId: PropTypes.string,
      })
    ),
    hasSeenSquads: PropTypes.bool,
    email: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
}

UserImpact.defaultProps = {}
export default UserImpact

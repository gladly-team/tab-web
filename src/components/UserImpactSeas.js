import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import Notification from 'src/components/Notification'
import InviteFriends from 'src/components/InviteFriends'
import ImpactCounter from 'src/components/ImpactCounter'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import dynamic from 'next/dynamic'
import { isPlural } from 'src/utils/formatting'
import confetti from 'canvas-confetti'
import Button from '@material-ui/core/Button'
import Markdown from 'src/components/Markdown'
import usePrevious from 'src/utils/hooks/usePrevious'
import EmailInviteDialog from 'src/components/EmailInviteDialog'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import { TAB_FOR_TEAMSEAS_CAUSE_ID } from 'src/utils/constants'

const DolphinGif = dynamic(() => import('src/components/DolphinGif'), {
  ssr: false,
})

const useStyles = makeStyles((theme) => ({
  impactCounter: { backgroundColor: '#fff', marginRight: theme.spacing(2) },
  bold: { fontWeight: 'bold' },
  canvas: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: '90000',
    pointerEvents: 'none',
  },
  title: { textAlign: 'center' },
  rootModal: {
    zIndex: '10000000 !important',
    borderRadius: theme.spacing(0.5),
  },
  walkMe: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  themedLink: {
    '& a': {
      color: theme.palette.primary.main,
    },
  },
  InviteFriends: { marginRight: theme.spacing(2) },
  centerImage: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  shareContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
const UserImpact = ({ user, disabled }) => {
  const { cause, userImpact } = user
  const {
    confirmedImpact,
    hasClaimedLatestReward,
    visitsUntilNextImpact,
    userImpactMetric,
    pendingUserReferralImpact,
    pendingUserReferralCount,
  } = userImpact

  const { impactVisits, impact } = cause

  const userId = user.id
  const showReward = confirmedImpact && !hasClaimedLatestReward
  const referralRewardNotificationOpen =
    pendingUserReferralImpact > 0 && pendingUserReferralCount > 0
  const prevVisitsUntilNextImpact = usePrevious(visitsUntilNextImpact)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(!confirmedImpact)
  const [newlyReferredDialogOpen, setNewlyReferredDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [referralRewardDialogOpen, setReferralRewardDialogOpen] =
    useState(false)
  const [claimedReferralImpact, setClaimedReferralImpact] = useState(0)
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
    if (
      visitsUntilNextImpact === impactVisits &&
      prevVisitsUntilNextImpact === 1
    ) {
      confettiFunc()
    }
  }, [impactVisits, visitsUntilNextImpact, prevVisitsUntilNextImpact])
  const handleConfirmDialogClose = async () => {
    setConfirmDialogOpen(false)
    if (pendingUserReferralImpact) {
      setNewlyReferredDialogOpen(true)
    } else {
      setAlertDialogOpen(true)
    }
    await UpdateImpactMutation(userId, TAB_FOR_TEAMSEAS_CAUSE_ID, {
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
    await UpdateImpactMutation(userId, TAB_FOR_TEAMSEAS_CAUSE_ID, {
      claimLatestReward: true,
    })
  }
  const handleRewardDialogClose = () => setRewardDialogOpen(false)

  const handleClaimReferralNotification = () => {
    setClaimedReferralImpact(pendingUserReferralImpact)
    setReferralRewardDialogOpen(true)
    UpdateImpactMutation(userId, TAB_FOR_TEAMSEAS_CAUSE_ID, {
      claimPendingUserReferralImpact: true,
    })
  }
  const handleReferralRewardDialogClose = async () => {
    setReferralRewardDialogOpen(false)
  }
  const classes = useStyles()
  return (
    <div>
      {visitsUntilNextImpact === impactVisits ? (
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
        dropdownText={impact.impactCounterText}
        className={classes.impactCounter}
        number={userImpactMetric}
        icon={impact.impactIcon}
        progress={
          // eslint-disable-next-line prettier/prettier

          // if user achieves a new milestone show the progress bar as full
          visitsUntilNextImpact === impactVisits
            ? 100
            : (1 - visitsUntilNextImpact / impactVisits) * 100
        }
      />
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={confirmDialogOpen}
        className={classes.rootModal}
      >
        <MuiDialogTitle disableTypography className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            Are you ready to turn your Tabs into a force for good?
          </Typography>
        </MuiDialogTitle>
        <MuiDialogContent className={classes.themedLink}>
          <div className={classes.centerImage}>
            <DolphinGif />
          </div>
          <Markdown>{impact.confirmImpactSubtitle}</Markdown>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button
            autoFocus
            onClick={handleConfirmDialogClose}
            variant="contained"
            color="primary"
          >
            I'M READY!
          </Button>
        </MuiDialogActions>
      </Dialog>
      <Dialog
        className={classes.rootModal}
        open={alertDialogOpen}
        onClose={handleAlertDialogClose}
      >
        <MuiDialogTitle disableTypography className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            Open a new tab
          </Typography>
        </MuiDialogTitle>
        <MuiDialogContent className={classes.walkMe}>
          <Markdown>{impact.impactWalkthroughText}</Markdown>
          <div className={classes.impactCounter}>
            <ImpactCounter
              includeNumber
              icon={impact.impactIcon}
              number={0}
              progress={100}
            />
          </div>
        </MuiDialogContent>
      </Dialog>
      <Dialog
        className={classes.rootModal}
        open={newlyReferredDialogOpen}
        onClose={handleNewlyReferredDialogOpen}
      >
        <MuiDialogTitle disableTypography className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            Open a new tab
          </Typography>
        </MuiDialogTitle>
        <MuiDialogContent className={classes.walkMe}>
          <Markdown>{impact.newlyReferredImpactWalkthroughText}</Markdown>
          <div className={classes.impactCounter}>
            <ImpactCounter
              includeNumber
              icon={impact.impactIcon}
              number={5}
              progress={100}
            />
          </div>
        </MuiDialogContent>
      </Dialog>
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
      <Dialog open={referralRewardDialogOpen} className={classes.rootModal}>
        <MuiDialogTitle disableTypography className={classes.root}>
          <Markdown>
            {
              // eslint-disable-next-line react/prop-types
              impact.referralRewardTitle
                // eslint-disable-next-line no-template-curly-in-string
                .replace('${claimedReferralImpact}', claimedReferralImpact)
            }
          </Markdown>
        </MuiDialogTitle>
        <MuiDialogContent>
          <div className={classes.centerImage}>
            <DolphinGif />
          </div>
          <Markdown>{impact.referralRewardSubtitle}</Markdown>
          <div className={classes.shareContainer}>
            <div className={classes.InviteFriends}>
              <InviteFriends user={user} />
            </div>
          </div>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button
            autoFocus
            onClick={handleReferralRewardDialogClose}
            color="primary"
          >
            DONE
          </Button>
        </MuiDialogActions>
      </Dialog>
      {showReward && (
        <Notification
          text={<Markdown>{impact.claimImpactSubtitle}</Markdown>}
          buttonText="Hooray"
          buttonOnClick={handleClaimReward}
        />
      )}
      {referralRewardNotificationOpen && (
        <Notification
          text={
            <div>
              <Typography>
                Congrats! You recruited{' '}
                <span style={{ fontWeight: 'bold' }}>
                  {`${pendingUserReferralCount} friend${isPlural(
                    pendingUserReferralCount
                  )} `}
                </span>
                to
              </Typography>
              <Markdown>
                {impact.referralRewardNotification
                  .replace(
                    // eslint-disable-next-line no-template-curly-in-string
                    '${pendingUserReferralImpact}',
                    pendingUserReferralImpact
                  )
                  .replace(
                    // eslint-disable-next-line no-template-curly-in-string
                    '${isPlural(pendingUserReferralImpact)}',
                    isPlural(pendingUserReferralImpact)
                  )}
              </Markdown>
            </div>
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
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    notifications: PropTypes.arrayOf(
      PropTypes.shape({ code: PropTypes.string })
    ),
    cause: PropTypes.shape({
      impactVisits: PropTypes.number.isRequired,
      impact: PropTypes.shape({
        impactCounterText: PropTypes.string.isRequired,
        claimImpactSubtitle: PropTypes.string.isRequired,
        referralRewardNotification: PropTypes.string.isRequired,
        impactIcon: PropTypes.string.isRequired,
        walkMeGif: PropTypes.string.isRequired,
        referralRewardTitle: PropTypes.string.isRequired,
        referralRewardSubtitle: PropTypes.string.isRequired,
        newlyReferredImpactWalkthroughText: PropTypes.string.isRequired,
        impactWalkthroughText: PropTypes.string.isRequired,
        confirmImpactSubtitle: PropTypes.string.isRequired,
      }).isRequired,
    }),
    userImpact: PropTypes.shape({
      visitsUntilNextImpact: PropTypes.number.isRequired,
      pendingUserReferralImpact: PropTypes.number.isRequired,
      pendingUserReferralCount: PropTypes.number.isRequired,
      userImpactMetric: PropTypes.number.isRequired,
      confirmedImpact: PropTypes.bool.isRequired,
      hasClaimedLatestReward: PropTypes.bool.isRequired,
    }).isRequired,
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

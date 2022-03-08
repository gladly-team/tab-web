import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import Notification from 'src/components/Notification'
import InviteFriends from 'src/components/InviteFriends'
import ImpactCounter from 'src/components/ImpactCounter'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { isPlural } from 'src/utils/formatting'
import { media } from 'src/utils/urls'
import confetti from 'canvas-confetti'
import Button from '@material-ui/core/Button'
import Markdown from 'src/components/Markdown'
import usePrevious from 'src/utils/hooks/usePrevious'
import EmailInviteDialogContainer from 'src/components/EmailInviteDialogContainer'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import SearchForACauseSellNotification from 'src/components/SearchForACauseSellNotification'
import SearchForACauseSellModal from 'src/components/SearchForACauseSellModal'

const useStyles = makeStyles((theme) => ({
  impactCounter: {
    backgroundColor: '#fff',
    marginRight: theme.spacing(1.5),
    marginLeft: theme.spacing(1.5),
  },
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
  center: { textAlign: 'center' },
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
const UserImpact = ({
  user,
  disabled,
  setFinishedSfacTestFlow,
  displaySfacSellModal,
}) => {
  const { cause, userImpact, showYahooPrompt } = user
  const {
    confirmedImpact,
    hasClaimedLatestReward,
    visitsUntilNextImpact,
    userImpactMetric,
    pendingUserReferralImpact,
    pendingUserReferralCount,
  } = userImpact

  const { impactVisits, impact, landingPagePath } = cause

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
  const [hardSellModalMode, setHardSellModalMode] =
    useState(displaySfacSellModal)
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
    await UpdateImpactMutation(userId, {
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
    await UpdateImpactMutation(userId, {
      claimLatestReward: true,
    })
  }
  const handleRewardDialogClose = () => setRewardDialogOpen(false)

  const handleClaimReferralNotification = () => {
    setClaimedReferralImpact(pendingUserReferralImpact)
    setReferralRewardDialogOpen(true)
    UpdateImpactMutation(userId, {
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
        dropdownTextSquads=""
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
          {impact.walkMeGif ? (
            <div className={classes.centerImage}>
              <img
                height="250"
                src={media(impact.walkMeGif)}
                alt={impact.walkMeGif}
                loading="lazy"
              />
            </div>
          ) : null}
          <div className={classes.center}>
            <Markdown>{impact.confirmImpactSubtitle}</Markdown>
          </div>
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
              dropdownText=""
              dropdownTextSquads=""
              includeNumber
              disableDropdown
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
              dropdownText=""
              disableDropdown
              dropdownTextSquads=""
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
        <EmailInviteDialogContainer
          username={user.username}
          userId={user.id}
          landingPagePath={landingPagePath}
          closeFunction={handleRewardDialogClose}
          user={user}
        />
      </Dialog>
      <Dialog open={referralRewardDialogOpen} className={classes.rootModal}>
        <MuiDialogTitle disableTypography className={classes.root}>
          <Markdown>
            {
              // eslint-disable-next-line react/prop-types
              impact.referralRewardTitle

                // Old formatting support:
                // adding \\ because of known prettier issue https://github.com/prettier/prettier/issues/6213
                // eslint-disable-next-line no-template-curly-in-string
                .replace('\\${claimedReferralImpact}', claimedReferralImpact)

                // Cleaner formatting, no preceding backslash:
                // eslint-disable-next-line no-template-curly-in-string
                .replace('${claimedReferralImpact}', claimedReferralImpact)
                .replace(
                  // eslint-disable-next-line no-template-curly-in-string
                  '${isPlural(claimedReferralImpact)}',
                  isPlural(claimedReferralImpact)
                )
            }
          </Markdown>
        </MuiDialogTitle>
        <MuiDialogContent>
          {impact.walkMeGif ? (
            <div className={classes.centerImage}>
              <img
                height="250"
                src={media(impact.walkMeGif)}
                alt={impact.walkMeGif}
                loading="lazy"
              />
            </div>
          ) : null}
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
          buttonText="Hooray!"
          buttonOnClick={handleClaimReward}
        />
      )}
      {referralRewardNotificationOpen && (
        <Notification
          text={
            <div>
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
      {hardSellModalMode !== null && (
        <SearchForACauseSellModal
          userId={userId}
          hardSell={hardSellModalMode}
          onAccept={() => setFinishedSfacTestFlow()}
          onDecline={() => setFinishedSfacTestFlow()}
        />
      )}
      {showYahooPrompt && (
        <SearchForACauseSellNotification
          userId={userId}
          onLearnMore={() => {
            setHardSellModalMode(false)
          }}
          onNoThanks={() => {
            setHardSellModalMode(true)
          }}
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
      landingPagePath: PropTypes.string.isRequired,
      impact: PropTypes.shape({
        impactCounterText: PropTypes.string.isRequired,
        claimImpactSubtitle: PropTypes.string.isRequired,
        referralRewardNotification: PropTypes.string.isRequired,
        impactIcon: PropTypes.string.isRequired,
        walkMeGif: PropTypes.string,
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
    showYahooPrompt: PropTypes.bool,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
  setFinishedSfacTestFlow: PropTypes.func,
  displaySfacSellModal: PropTypes.bool,
}

UserImpact.defaultProps = {
  setFinishedSfacTestFlow: () => {},
  displaySfacSellModal: null,
}
export default UserImpact

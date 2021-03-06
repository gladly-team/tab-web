import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash/object'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'
import ImpactCounter from 'src/components/ImpactCounter'
import RandomGif from 'src/components/RandomGif'
import InviteFriends from 'src/components/InviteFriends'
import { isPlural } from 'src/utils/formatting'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  currencyText: { color: get(theme, 'palette.backgroundContrastText.main') },
  title: { textAlign: 'center' },
  rootModal: { zIndex: '10000000 !important', borderRadius: '5px' },
  walkMe: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  impactCounter: { padding: '15px' },
  InviteFriends: { marginRight: '15px' },
  justify: { textAlign: 'justify' },
  typographySpacing: { paddingTop: '15px' },
  centerImage: { display: 'flex', justifyContent: 'center' },
  shareContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '15px',
  },
}))
const ImpactDialog = ({
  modalType,
  open,
  buttonOnClick,
  onClose,
  referralImpact,
  user,
}) => {
  const classes = useStyles()
  let dialogContent
  switch (modalType) {
    case 'confirmImpact':
      if (open && typeof buttonOnClick !== 'function') {
        throw new Error('props in confirm Impact dialog are incorrect')
      }
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              Are you ready to turn your Tabs into a force for good?
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent>
            <div className={classes.centerImage}>
              <RandomGif />
            </div>
            <Typography
              className={clsx(classes.typographySpacing, classes.justify)}
            >
              Each time you open a tab, you'll be helping shelter cats get
              adopted by{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://thejacksongalaxyproject.greatergood.org/about/cat-pawsitive/"
              >
                providing treats to be used in positive reinforcement training
              </a>
              . Ready to get started?
            </Typography>
          </MuiDialogContent>
          <MuiDialogActions>
            <Button
              autoFocus
              onClick={buttonOnClick}
              variant="contained"
              color="primary"
            >
              I'M READY!
            </Button>
          </MuiDialogActions>
        </>
      )
      break
    case 'impactWalkMe':
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              Open a new tab
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent className={classes.walkMe}>
            <Typography className={classes.justify}>
              When you do, you'll donate enough to give a shelter cat a treat
              during training. We'll track how many treats you've given on the
              top of the page:
            </Typography>
            <div className={classes.impactCounter}>
              <ImpactCounter includeNumber number={0} progress={100} />
            </div>
          </MuiDialogContent>
        </>
      )
      break
    case 'newlyReferredImpactWalkMe':
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              Open a new tab
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent className={classes.walkMe}>
            <Typography className={classes.justify}>
              Your friend started you off with 5 cat treats, which are crucial
              to getting shelter cats adopted. Open a new tab now to earn your
              6th treat! We'll track how many treats you've given on the top of
              the page:
            </Typography>
            <div className={classes.impactCounter}>
              <ImpactCounter includeNumber number={5} progress={100} />
            </div>
          </MuiDialogContent>
        </>
      )
      break
    case 'claimImpactReward':
      if (open && (!user || typeof buttonOnClick !== 'function')) {
        throw new Error('missing props in claim impact reward dialog')
      }
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              Feed 10 more cats right now with the help of a friend!
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent>
            <div className={classes.centerImage}>
              <RandomGif />
            </div>
            <Typography
              className={clsx(classes.typographySpacing, classes.justify)}
            >
              The more people who open tabs, the more good we can do! Get a
              friend on board and you'll each earn another 5 treats to give to
              shelter cats:
            </Typography>
            <div className={classes.shareContainer}>
              <div className={classes.InviteFriends}>
                <InviteFriends user={user} className={classes.InviteFriends} />
              </div>
            </div>
          </MuiDialogContent>
          <MuiDialogActions>
            <Button autoFocus onClick={buttonOnClick} color="primary">
              DONE
            </Button>
          </MuiDialogActions>
        </>
      )
      break
    case 'claimReferralReward':
      if (
        open &&
        (!referralImpact || !user || typeof buttonOnClick !== 'function')
      ) {
        throw new Error('missing props in claim referral reward dialog')
      }
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6" className={classes.title}>
              {`You just put ${referralImpact} cat${isPlural(
                referralImpact
              )} on track for adoption!`}
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent>
            <div className={classes.centerImage}>
              <RandomGif />
            </div>
            <Typography
              className={clsx(classes.typographySpacing, classes.justify)}
            >
              Congratulations! You're making a huge impact for these animals in
              need. Want to help even more cats? Invite a few more friends!
            </Typography>
            <div className={classes.shareContainer}>
              <div className={classes.InviteFriends}>
                <InviteFriends user={user} />
              </div>
            </div>
          </MuiDialogContent>
          <MuiDialogActions>
            <Button autoFocus onClick={buttonOnClick} color="primary">
              DONE
            </Button>
          </MuiDialogActions>
        </>
      )
      break
    default:
      throw new Error('incorrect dialog type')
  }

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      className={classes.rootModal}
    >
      {dialogContent}
    </Dialog>
  )
}

ImpactDialog.displayName = 'ImpactDialog'
ImpactDialog.propTypes = {
  modalType: PropTypes.oneOf([
    'confirmImpact',
    'impactWalkMe',
    'newlyReferredImpactWalkMe',
    'claimImpactReward',
    'claimReferralReward',
  ]).isRequired,
  buttonOnClick: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  referralImpact: PropTypes.number,
  user: PropTypes.shape({ username: PropTypes.string }),
}
ImpactDialog.defaultProps = {
  onClose: undefined,
  referralImpact: undefined,
  buttonOnClick: undefined,
  user: undefined,
}

export default ImpactDialog

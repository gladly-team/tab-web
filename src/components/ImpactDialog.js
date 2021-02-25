import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash/object'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  currencyText: { color: get(theme, 'palette.backgroundContrastText.main') },
  rootModal: { zIndex: '10000000 !important' },
  centerImage: { display: 'flex', justifyContent: 'center' },
}))
const ImpactDialog = ({
  modalType,
  open,
  buttonOnClick,
  onClose,
  referralImpact,
}) => {
  const classes = useStyles()
  let dialogContent
  switch (modalType) {
    case 'confirmImpact':
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">
              Are you ready to turn your Tabs into a force for good?
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent>
            <div className={classes.centerImage}>
              <iframe
                src="https://giphy.com/embed/vFKqnCdLPNOKc"
                title="giphytitle"
                width="344"
                height="219"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <Typography gutterBottom>
              Each time you open a tab, you'll be helping shelter cats get
              adopted by providing treats to be used in positive reinforcement
              training. Ready to get started?
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
            <Typography variant="h6">Open a new tab</Typography>
          </MuiDialogTitle>
          <MuiDialogContent>
            <DialogContentText id="alert-dialog-description">
              When you do, you'll donate enough to give a shelter cat a treat
              during training. We'll track how many treats you've given on the
              top of the page:
            </DialogContentText>
          </MuiDialogContent>
        </>
      )
      break
    case 'claimImpactReward':
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">
              You just helped a shelter cat! Congrats!
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent>
            <div className={classes.centerImage}>
              <iframe
                src="https://giphy.com/embed/vFKqnCdLPNOKc"
                title="giphytitle"
                width="344"
                height="219"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <Typography gutterBottom>
              The more people who open tabs, the more good we can do! \n Get a
              friend on board and we'll give a treat to another 10 shelter cats:
            </Typography>
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
      dialogContent = (
        <>
          <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">
              {`You just put ${referralImpact} cats on track for adoption!`}
            </Typography>
          </MuiDialogTitle>
          <MuiDialogContent>
            <div className={classes.centerImage}>
              <iframe
                src="https://giphy.com/embed/vFKqnCdLPNOKc"
                title="giphytitle"
                width="344"
                height="219"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <Typography gutterBottom>
              Congratulations! You're making a huge impact for these animals in
              need. Want to help even more cats? Invite a few more friends!
            </Typography>
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
      dialogContent = <div />
      break
  }

  return (
    <Dialog
      onClose={onClose || buttonOnClick}
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
    'claimImpactReward',
    'claimReferralReward',
  ]).isRequired,
  buttonOnClick: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/require-default-props
  referralImpact: PropTypes.number,
}
ImpactDialog.defaultProps = {
  onClose: () => {},
  buttonOnClick: () => {},
}

export default ImpactDialog

import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import { ArrowForwardIos } from '@material-ui/icons'
import Notification from '../Notification'

const useStyles = makeStyles((theme) => ({
  learnButton: {
    height: '30px',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  noThanksButton: {
    marginLeft: 'auto',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '5ayw00',
    fontFamily: 'Poppins',
  },
  nextGoalButton: {
    background: '#29BEBA',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '900',
    fontFamily: 'Poppins',
    marginLeft: theme.spacing(1),
    color: 'white',
  },
  title: {
    fontWeight: '700',
    fontSize: '24px',
    fontFamily: 'Poppins',
  },
  buttonsWrapper: {
    display: 'flex',
    marginLeft: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  notification: {
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(0),
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    height: theme.spacing(6),
  },
  notificationButtons: {
    width: 'auto',
  },
  startedButton: {
    color: '#29BEBA',
    padding: theme.spacing(0),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  notificationText: {
    fontWeight: '900',
  },
}))
const GroupGoalNotification = ({
  mode,
  open,
  onDetails,
  onNextGoal,
  onGoalStarted,
  impactTitle,
}) => {
  const classes = useStyles()
  const onDetailsHandler = () => {
    onDetails()
  }
  const onNextGoalHandler = () => {
    onNextGoal()
  }

  return (
    <div className={classes.wrapper}>
      <Notification
        className={classes.notification}
        buttonsClassName={classes.notificationButtons}
        open={open}
        text={
          <Typography className={classes.notificationText} variant="body2">
            {mode === 'completed' ? 'COMPLETED' : 'GOAL STARTED'}: {impactTitle}
          </Typography>
        }
        buttons={
          mode === 'completed' ? (
            <div className={classes.buttonsWrapper}>
              <Button
                onClick={onDetailsHandler}
                className={classes.noThanksButton}
                variant="outlined"
              >
                Details
              </Button>
              <Button
                onClick={onNextGoalHandler}
                className={classes.nextGoalButton}
                variant="contained"
                disableElevation
              >
                Next Goal
              </Button>
            </div>
          ) : (
            <Button onClick={onGoalStarted} className={classes.startedButton}>
              <ArrowForwardIos />
            </Button>
          )
        }
      />
    </div>
  )
}

GroupGoalNotification.propTypes = {
  mode: PropTypes.oneOf(['completed', 'started']).isRequired,
  open: PropTypes.bool.isRequired,
  onDetails: PropTypes.func.isRequired,
  onNextGoal: PropTypes.func.isRequired,
  onGoalStarted: PropTypes.func.isRequired,
  impactTitle: PropTypes.string.isRequired,
}

export default GroupGoalNotification

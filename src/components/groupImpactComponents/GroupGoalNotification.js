import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import { ArrowForwardIos } from '@material-ui/icons'
import { GROUP_IMPACT_SIDEBAR_STATE } from 'src/utils/constants'
import gtag from 'ga-gtag'
import Handlebars from 'handlebars'
import Notification from '../Notification'

const useStyles = makeStyles((theme) => ({
  learnButton: {
    fontWeight: '500',
    height: 24,
  },
  noThanksButton: {
    marginLeft: 'auto',
    fontWeight: '500',
    height: 24,
  },
  nextGoalButton: {
    fontWeight: '900',
    marginLeft: theme.spacing(1),
    height: 24,
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
    height: 40,
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
  impactCountPerMetric,
}) => {
  const impactTitleTemplate = Handlebars.compile(impactTitle)
  const impactTitleCompiled = impactTitleTemplate({
    count: impactCountPerMetric,
    multiple: impactCountPerMetric > 1,
  })
  const classes = useStyles()
  const onDetailsHandler = useCallback(() => {
    gtag('event', 'group_impact_notification', {
      interaction: 'details',
      mode,
    })
    onDetails()
  }, [mode, onDetails])
  const onNextGoalHandler = useCallback(() => {
    gtag('event', 'group_impact_notification', {
      interaction: 'next_goal',
      mode,
    })
    onNextGoal()
  }, [mode, onNextGoal])
  const onGoalStartedHandler = useCallback(() => {
    gtag('event', 'group_impact_notification', {
      interaction: 'goal_started',
      mode,
    })
    onGoalStarted()
  }, [mode, onGoalStarted])

  return (
    <div className={classes.wrapper}>
      <Notification
        className={classes.notification}
        buttonsClassName={classes.notificationButtons}
        open={open}
        text={
          <Typography className={classes.notificationText} variant="body2">
            {mode === GROUP_IMPACT_SIDEBAR_STATE.COMPLETED
              ? 'COMPLETED'
              : 'GOAL STARTED'}
            : {impactTitleCompiled}
          </Typography>
        }
        buttons={
          mode === GROUP_IMPACT_SIDEBAR_STATE.COMPLETED ? (
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
            <Button
              onClick={onGoalStartedHandler}
              className={classes.startedButton}
            >
              <ArrowForwardIos />
            </Button>
          )
        }
      />
    </div>
  )
}

GroupGoalNotification.propTypes = {
  mode: PropTypes.oneOf([
    GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
    GROUP_IMPACT_SIDEBAR_STATE.NEW,
  ]).isRequired,
  open: PropTypes.bool.isRequired,
  onDetails: PropTypes.func.isRequired,
  onNextGoal: PropTypes.func.isRequired,
  onGoalStarted: PropTypes.func.isRequired,
  impactTitle: PropTypes.string.isRequired,
  impactCountPerMetric: PropTypes.number.isRequired,
}

export default GroupGoalNotification

import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { isNil } from 'lodash/lang'
import moment from 'moment'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
// import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
// import Button from '@material-ui/core/Button'
// import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle'
import ArrowRight from '@material-ui/icons/ArrowRight'
// import Group from '@material-ui/icons/Group'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'
// import RemoveCircle from '@material-ui/icons/RemoveCircle'
import Schedule from '@material-ui/icons/Schedule'
// import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    maxWidth: 600,
  },
  title: {
    fontSize: 14,
  },
  timeContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  timeIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    width: 14,
    height: 14,
  },
  subtitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  impactContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  impactCompactView: {
    borderRadius: '50%',
    width: 50,
    minWidth: 50,
    height: 50,
    minHeight: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    width: '1em',
    height: '1em',
    marginRight: theme.spacing(2),
  },
  successColor: {
    color: green['500'],
  },
  failureColor: {
    color: red['500'],
  },
  subtitleIcon: {
    // Make the subtitle text align with the title text.
    marginRight: `calc(${theme.spacing(2)}px + 0.14em)`,
    width: '0.86em',
    height: '0.86em',
  },
  requirementsIcon: {
    color: theme.palette.text.secondary,
  },
  groupIcon: {
    color: theme.palette.text.secondary,
  },
  skipIcon: {
    color: theme.palette.text.secondary,
    // color: yellow['500'],
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(0),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(2),
  },
  progressCheckmark: {
    margin: theme.spacing(1),
    color: green['500'],
  },
  progressBar: {
    flex: 1,
    margin: theme.spacing(2),
  },
  descriptionContainer: {
    margin: theme.spacing(2),
  },
}))

const HowToAchieveIcon = ArrowRight
const SUCCESS = 'success'
const FAILURE = 'failure'
const IN_PROGRESS = 'inProgress'

/**
 * Return the formatted date to display, as a "time since X" format
 * or "time from now" format.
 * @param {String} time - An ISO timestamp
 * @return {String} Time text, such as "2 days ago" or "a few
 *   seconds remaining".
 */
const getTimeDisplay = (time) => {
  const now = moment()
  const timeMoment = moment(time)
  let displayedTime = ''
  if (timeMoment.isBefore(now)) {
    // "time ago":
    // https://momentjs.com/docs/#/displaying/fromnow/
    displayedTime = timeMoment.fromNow(false)
  } else {
    // "in X time"
    // https://momentjs.com/docs/#/displaying/from/
    displayedTime = `${timeMoment.from(now, true)} remaining`
  }
  return displayedTime
}

const Achievement = (props) => {
  const {
    className,
    completionTime,
    deadlineTime,
    impactText,
    status,
    taskText,
  } = props
  const classes = useStyles()

  let StatusIcon = null
  switch (status) {
    case SUCCESS:
      StatusIcon = (
        <CheckCircle
          className={clsx(classes.statusIcon, classes.successColor)}
        />
      )
      break
    case FAILURE:
      StatusIcon = (
        <Cancel className={clsx(classes.statusIcon, classes.failureColor)} />
      )
      break
    case IN_PROGRESS:
      StatusIcon = null
      break
    default:
      StatusIcon = null
  }

  // If the achievement is in progress, display the formatted deadlineTime,
  // if it exists. If the achievement has ended, display the formatted
  // completionTime.
  let timeToDisplay = null
  if (status === IN_PROGRESS && !isNil(deadlineTime)) {
    // Warn if it's not a valid time.
    if (!moment(deadlineTime).isValid()) {
      // eslint-disable-next-line no-console
      console.warn('Invalid "deadlineTime" timestamp provided to Achievement.')
    } else {
      timeToDisplay = getTimeDisplay(deadlineTime)
    }
  } else if (status === SUCCESS || status === FAILURE) {
    // Warn if a valid completionTime is not provided.
    if (isNil(completionTime) || !moment(completionTime).isValid()) {
      // eslint-disable-next-line no-console
      console.warn(
        'Invalid "completionTime" timestamp provided to Achievement.'
      )
    } else {
      timeToDisplay = getTimeDisplay(completionTime)
    }
  } else {
    // We expect no displayed time if the achievement is in progress and
    // there isn't a deadline time.
    timeToDisplay = null
  }

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent>
        {timeToDisplay ? (
          <div className={classes.timeContainer} data-test-id="time-container">
            {status === IN_PROGRESS ? (
              <Schedule className={classes.timeIcon} />
            ) : null}
            <Typography
              className={classes.title}
              color="textSecondary"
              variant="body2"
            >
              {timeToDisplay}
            </Typography>
          </div>
        ) : null}
        <div
          className={classes.impactContainer}
          data-test-id="impact-text-container"
        >
          {StatusIcon}
          <Typography variant="h5">{impactText}</Typography>
        </div>
        <div className={classes.subtitleContainer}>
          <HowToAchieveIcon
            className={clsx(classes.subtitleIcon, classes.requirementsIcon)}
          />
          <Typography variant="subtitle1" color="textSecondary">
            {taskText}
          </Typography>
        </div>
        <div className={classes.progressContainer}>
          <CheckCircle className={classes.progressCheckmark} />
          <CheckCircle className={classes.progressCheckmark} />
          <CheckCircle className={classes.progressCheckmark} />
          <RadioButtonUnchecked className={classes.progressCheckmark} />
          <RadioButtonUnchecked className={classes.progressCheckmark} />
          <RadioButtonUnchecked className={classes.progressCheckmark} />
          <RadioButtonUnchecked className={classes.progressCheckmark} />
        </div>
      </CardContent>
    </Card>
  )
}

Achievement.displayName = 'Achievement'

// TODO: make this component handle all use cases and create a
// demo page that shows each goal in progress, succeeded, and failed.

// Draft of data:
// eslint-disable-next-line
const propSpecs = {
  impactText: PropTypes.string.isRequired, // e.g., "Plant 1 Tree"
  taskText: PropTypes.string.isRequired, // e.g., "Open 10 tabs"
  descriptionMarkdown: PropTypes.string, // longer content
  status: PropTypes.string.isRequired, // one of: "inProgress", "success", "failure"
  // ISO timestamp or null. Null if not yet completed.
  // If successful, the successful completion time.
  // If failed, the time the goal ended.
  completionTime: PropTypes.string,
  // ISO timestamp or null. Null if there is no deadline.
  deadlineTime: PropTypes.string,
  // Whether this is a goal for the entire Tab community. Default
  // to false.
  progress: PropTypes.shape({
    targetNumber: PropTypes.number.isRequired,
    currentNumber: PropTypes.number.isRequired,
    // How to display the progress.
    // One of: "progressBar", "checkMarks",
    type: PropTypes.string.isRequired,
    // Start without these things, which can get complicated:
    // itemNameSingular: PropTypes.string.isRequired, // e.g. "tab", "friend", "day"
    // itemNamePlural: PropTypes.string.isRequired, // e.g., "tabs", "friends", "days"
  }),
  isCommunityGoal: PropTypes.bool,
  showShareButton: PropTypes.bool,
  showInviteFriendsButton: PropTypes.bool,
  // Content to show when sharing. Refer to the current Tab campaign
  // logic. We may want to fetch this only after a user clicks
  // to share.
  socialSharing: PropTypes.shape({}),
  // An option to show only the success/fail icon, plus info on hover.
  compactBadge: PropTypes.bool,
}

Achievement.propTypes = {
  className: PropTypes.string,
  impactText: PropTypes.string.isRequired, // e.g., "Plant 1 Tree"
  taskText: PropTypes.string.isRequired, // e.g., "Open 10 tabs"
  // descriptionMarkdown: PropTypes.string, // longer content
  // Whether the achievement has been completed or not.
  status: PropTypes.oneOf(['inProgress', 'success', 'failure']).isRequired,
  // Whether this is the user's current (most recent) achievement.
  // isCurrentAchievement: PropTypes.bool.isRequired,
  // // ISO timestamp or null. Null if not yet completed.
  // // If successful, the successful completion time.
  // // If failed, the time the goal ended.
  completionTime: PropTypes.string,
  // ISO timestamp or null. Null if there is no deadline.
  deadlineTime: PropTypes.string,
  // // Whether this is a goal for the entire Tab community. Default
  // // to false.
  // isCommunityGoal: PropTypes.bool,
  // progress: PropTypes.shape({
  //   targetNumber: PropTypes.number.isRequired,
  //   currentNumber: PropTypes.number.isRequired,
  //   // How to display the progress.
  //   // One of: "progressBar", "checkMarks",
  //   type: PropTypes.string.isRequired,
  //   // Start without these things, which can get complicated:
  //   // itemNameSingular: PropTypes.string.isRequired, // e.g. "tab", "friend", "day"
  //   // itemNamePlural: PropTypes.string.isRequired, // e.g., "tabs", "friends", "days"
  // }),
  // showShareButton: PropTypes.bool,
  // showInviteFriendsButton: PropTypes.bool,
  // // Content to show when sharing. Refer to the current Tab campaign
  // // logic. We may want to fetch this only after a user clicks
  // // to share.
  // socialSharing: PropTypes.shape({}),
  // // An option to show only the success/fail icon, plus info on hover.
  // compactBadge: PropTypes.bool,
}
Achievement.defaultProps = {
  className: '',
  completionTime: null,
  deadlineTime: null,
}

export default Achievement

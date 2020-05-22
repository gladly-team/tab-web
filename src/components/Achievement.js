import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { isNil } from 'lodash/lang'
import moment from 'moment'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
// import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle'
import ArrowRight from '@material-ui/icons/ArrowRight'
import Group from '@material-ui/icons/Group'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import Schedule from '@material-ui/icons/Schedule'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 400,
    maxWidth: 600,
  },
  cardContent: {
    paddingBottom: theme.spacing(1),
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
  topTextContainer: {
    marginBottom: theme.spacing(1),
  },
  impactContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  subtitleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  // impactCompactView: {
  //   borderRadius: '50%',
  //   width: 50,
  //   minWidth: 50,
  //   height: 50,
  //   minHeight: 50,
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
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
  progressContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1),
    justifyContent: 'center',
  },
  progressCheckmarksContainer: {
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  progressCheckmark: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: green['500'],
  },
  progressCheckmarkUnchecked: {
    color: grey['500'],
  },
  progressBar: {
    flex: 1,
    margin: theme.spacing(2),
  },
  descriptionContainer: {
    padding: theme.spacing(1),
  },
}))

const HowToAchieveIcon = ArrowRight
const SUCCESS = 'success'
const FAILURE = 'failure'
const IN_PROGRESS = 'inProgress'

const CHECKMARKS = 'checkmarks'
const PROGRESS_BAR = 'progressBar'

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
    badgeClassName,
    badgeOnly,
    className,
    completionTime,
    deadlineTime,
    description,
    descriptionTwo,
    impactText,
    inviteFriendsButton,
    isCommunityGoal,
    nextGoalButton,
    progress,
    shareButton,
    status,
    taskText,
  } = props
  const classes = useStyles()

  // If it's a badge, return a substantially different component.
  if (badgeOnly) {
    // TODO
    return <div className={badgeClassName}>badge!</div>
  }

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

  // Visualize the progress if the "progress" data is provided.
  let progressContent = null
  if (progress) {
    const { currentNumber, targetNumber, visualizationType } = progress
    switch (visualizationType) {
      case CHECKMARKS: {
        // Don't allow rendering a massive number of checkmarks.
        const MAX_CHECKMARKS_ALLOWED = 20
        const numCheckmarksToRender =
          targetNumber > MAX_CHECKMARKS_ALLOWED
            ? MAX_CHECKMARKS_ALLOWED
            : targetNumber
        if (targetNumber > MAX_CHECKMARKS_ALLOWED) {
          // eslint-disable-next-line no-console
          console.warn(
            `Large number of checkmarks attempted to render in Achievement. Limiting to ${MAX_CHECKMARKS_ALLOWED} checkmarks.`
          )
        }

        const checkmarks = []
        for (let i = 0; i < numCheckmarksToRender; i += 1) {
          if (i < currentNumber) {
            checkmarks.push(
              <CheckCircle
                key={`checkmark-${i}`}
                className={classes.progressCheckmark}
              />
            )
          } else {
            checkmarks.push(
              <RadioButtonUnchecked
                key={`checkmark-${i}`}
                className={clsx(
                  classes.progressCheckmark,
                  classes.progressCheckmarkUnchecked
                )}
              />
            )
          }
        }
        progressContent = (
          <div className={classes.progressCheckmarksContainer}>
            {checkmarks}
          </div>
        )
        break
      }
      case PROGRESS_BAR: {
        progressContent = (
          <LinearProgress
            variant="determinate"
            value={(currentNumber / targetNumber) * 100}
            color="primary"
            className={classes.progressBar}
          />
        )
        break
      }
      default:
        progressContent = null
    }
  }

  const {
    show: showInviteFriendsButton,
    text: inviteFriendsButtonText = 'Invite Friends',
  } = inviteFriendsButton
  const { show: showShareButton, text: shareButtonText = 'Share' } = shareButton
  const {
    show: showNextGoalButton,
    text: nextGoalButtonText = 'Next Goal',
  } = nextGoalButton
  const hasButton =
    showInviteFriendsButton || showShareButton || showNextGoalButton

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent className={classes.cardContent}>
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
        <div className={classes.topTextContainer}>
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
          {isCommunityGoal ? (
            <div className={classes.subtitleContainer}>
              <Group
                className={clsx(classes.subtitleIcon, classes.groupIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Community goal
              </Typography>
            </div>
          ) : null}
        </div>
        {/* 
          We may want to make this collapsible:
          https://material-ui.com/components/cards/#complex-interaction
        */}
        {description ? (
          <div className={classes.descriptionContainer}>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </div>
        ) : null}
        {progressContent ? (
          <div
            className={classes.progressContainer}
            data-test-id="progress-container"
          >
            {progressContent}
          </div>
        ) : null}
        {descriptionTwo ? (
          <div className={classes.descriptionContainer}>
            <Typography variant="body2" color="textSecondary">
              {descriptionTwo}
            </Typography>
          </div>
        ) : null}
      </CardContent>
      {hasButton ? (
        <CardActions>
          {showNextGoalButton ? (
            <Button color="default">{nextGoalButtonText}</Button>
          ) : null}
          {showInviteFriendsButton ? (
            <Button color="default">{inviteFriendsButtonText}</Button>
          ) : null}
          {showShareButton ? (
            <Button color="default">{shareButtonText}</Button>
          ) : null}
        </CardActions>
      ) : null}
    </Card>
  )
}

Achievement.displayName = 'Achievement'

Achievement.propTypes = {
  badgeClassName: PropTypes.string, // applied when the "badgeOnly" prop is true
  // An option to show only the success/fail icon.
  badgeOnly: PropTypes.bool,
  className: PropTypes.string,
  impactText: PropTypes.string.isRequired, // e.g., "Plant 1 Tree"
  taskText: PropTypes.string.isRequired, // e.g., "Open 10 tabs"
  // May want to accept descriptionMarkdown in the future.
  description: PropTypes.string,
  descriptionTwo: PropTypes.string,
  // Whether the achievement has been completed or not.
  status: PropTypes.oneOf([IN_PROGRESS, SUCCESS, FAILURE]).isRequired,
  // ISO timestamp or null. Null if not yet completed.
  // If successful, the successful completion time.
  // If failed, the time the goal ended.
  completionTime: PropTypes.string,
  // ISO timestamp or null. Null if there is no deadline.
  deadlineTime: PropTypes.string,
  // Whether this is a goal for the entire Tab community. Default
  // to false.
  isCommunityGoal: PropTypes.bool,
  progress: PropTypes.shape({
    currentNumber: PropTypes.number.isRequired,
    targetNumber: PropTypes.number.isRequired,
    // How to visually display the progress.
    visualizationType: PropTypes.oneOf([PROGRESS_BAR, CHECKMARKS]).isRequired,
    // Perhaps add: leftLabelText, rightLabelText?
  }),
  shareButton: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    text: PropTypes.string,
  }),
  inviteFriendsButton: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    text: PropTypes.string,
  }),
  nextGoalButton: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    text: PropTypes.string,
  }),
  // Content to show when sharing. Refer to the current Tab campaign
  // logic. We may want to fetch this only after a user clicks
  // to share.
  // TODO:
  // socialSharing: PropTypes.shape({}),
}

Achievement.defaultProps = {
  badgeClassName: '',
  badgeOnly: false,
  className: '',
  completionTime: null,
  deadlineTime: null,
  description: null,
  descriptionTwo: null,
  inviteFriendsButton: {
    show: false,
    text: 'Invite Friends',
  },
  isCommunityGoal: false,
  nextGoalButton: {
    show: false,
    text: 'Next Goal',
  },
  progress: null,
  shareButton: {
    show: false,
    text: 'Share',
  },
}

export default Achievement

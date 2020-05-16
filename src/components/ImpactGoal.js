import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'
import red from '@material-ui/core/colors/red'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Group from '@material-ui/icons/Group'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import Schedule from '@material-ui/icons/Schedule'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    maxWidth: 700,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
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
  statusIcon: {
    marginRight: theme.spacing(1),
  },
  groupIcon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1),
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
  },
  progressCheckmark: {
    margin: theme.spacing(1),
  },
  progressBar: {
    flex: 1,
    margin: theme.spacing(2),
  },
}))

const ImpactGoal = (props) => {
  const { className, demo } = props
  const classes = useStyles()
  const bull = <span className={classes.bullet}>•</span>

  let content
  switch (demo) {
    case 'tab7days':
      content = (
        <>
          <CardContent>
            <div className={classes.timeContainer}>
              <Schedule className={classes.timeIcon} />
              <Typography
                className={classes.title}
                color="textSecondary"
                variant="body2"
              >
                4d remaining
              </Typography>
            </div>
            <div className={classes.impactContainer}>
              <Typography variant="h5">Plants 1 tree</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Typography variant="subtitle1" color="textSecondary">
                Tab 7 days in a row
              </Typography>
            </div>
            <div className={classes.progressContainer}>
              <CheckCircle
                htmlColor={green['500']}
                className={classes.progressCheckmark}
              />
              <CheckCircle
                htmlColor={green['500']}
                className={classes.progressCheckmark}
              />
              <CheckCircle
                htmlColor={green['500']}
                className={classes.progressCheckmark}
              />
              <RadioButtonUnchecked
                className={classes.progressCheckmark}
                htmlColor={grey['600']}
              />
              <RadioButtonUnchecked
                className={classes.progressCheckmark}
                htmlColor={grey['600']}
              />
              <RadioButtonUnchecked
                className={classes.progressCheckmark}
                htmlColor={grey['600']}
              />
              <RadioButtonUnchecked
                className={classes.progressCheckmark}
                htmlColor={grey['600']}
              />
            </div>
          </CardContent>
        </>
      )
      break
    case 'library':
      content = (
        <>
          <CardContent>
            <div className={classes.timeContainer}>
              <Schedule className={classes.timeIcon} />
              <Typography
                className={classes.title}
                color="textSecondary"
                variant="body2"
              >
                12d remaining
              </Typography>
            </div>
            <div className={classes.impactContainer}>
              <Typography variant="h5">Build a library in Cambodia</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Group className={classes.groupIcon} />
              <Typography variant="subtitle1" color="textSecondary">
                We're working on this together
              </Typography>
            </div>
            <div className={classes.progressContainer}>
              <LinearProgress
                variant="determinate"
                value={72}
                color="primary"
                className={classes.progressBar}
              />
            </div>
          </CardContent>
        </>
      )
      break
    case '100tabs':
      content = (
        <>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              variant="body2"
              gutterBottom
            >
              April 24
            </Typography>
            <div className={classes.impactContainer}>
              <CheckCircle
                htmlColor={green['500']}
                className={clsx(classes.statusIcon)}
              />
              <Typography variant="h5">1 tree planted</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Typography variant="subtitle1" color="textSecondary">
                Opened 100 tabs
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Button color="default">Share</Button>
          </CardActions>
        </>
      )
      break
    case 'recruitFriend':
      content = (
        <>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              variant="body2"
              gutterBottom
            >
              April 14
            </Typography>
            <div className={classes.impactContainer}>
              <Cancel
                htmlColor={red['500']}
                className={clsx(classes.statusIcon)}
              />
              <Typography variant="h5">No trees planted</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Typography variant="subtitle1" color="textSecondary">
                Recruit 1 friend
              </Typography>
            </div>
          </CardContent>
        </>
      )
      break
    case 'meals':
      content = (
        <>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              variant="body2"
              gutterBottom
            >
              April 10
            </Typography>
            <div className={classes.impactContainer}>
              <CheckCircle
                htmlColor={green['500']}
                className={clsx(classes.statusIcon)}
              />
              <Typography variant="h5">Give 25,000 meals to kids</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Group className={classes.groupIcon} />
              <Typography variant="subtitle1" color="textSecondary">
                We achieved this together
              </Typography>
            </div>
          </CardContent>
          <CardActions>
            <Button color="default">Share</Button>
          </CardActions>
        </>
      )
      break
    default:
      content = (
        <>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Word of the Day
            </Typography>
            <Typography variant="h5" component="h2">
              be{bull}nev{bull}o{bull}lent
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              adjective
            </Typography>
            <Typography variant="body2" component="p">
              well meaning and kindly.
              <br />
              "a benevolent smile"
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </>
      )
  }

  return <Card className={clsx(classes.root, className)}>{content}</Card>
}

ImpactGoal.displayName = 'ImpactGoal'
ImpactGoal.propTypes = {
  className: PropTypes.string,
  demo: PropTypes.string.isRequired,
}
ImpactGoal.defaultProps = {
  className: '',
}

export default ImpactGoal

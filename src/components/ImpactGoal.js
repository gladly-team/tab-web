import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
// import yellow from '@material-ui/core/colors/yellow'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Cancel from '@material-ui/icons/Cancel'
import CheckCircle from '@material-ui/icons/CheckCircle'
import ArrowRight from '@material-ui/icons/ArrowRight'
// import DoubleArrow from '@material-ui/icons/DoubleArrow'
import Group from '@material-ui/icons/Group'
import RadioButtonUnchecked from '@material-ui/icons/RadioButtonUnchecked'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
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
    marginRight: theme.spacing(2),
  },
  successColor: {
    color: green['500'],
  },
  failureColor: {
    color: red['500'],
  },
  subtitleIcon: {
    marginRight: theme.spacing(2),
    width: '0.86em',
    height: '0.86em',
    // TODO: make subtitle text align with title
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
// const HowToAchieveIcon = DoubleArrow

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
              <Typography variant="h5">Plant 1 tree</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <HowToAchieveIcon
                className={clsx(classes.subtitleIcon, classes.requirementsIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Open tabs 7 days in a row
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
              <HowToAchieveIcon
                className={clsx(classes.subtitleIcon, classes.requirementsIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Recruit 1,000 new people
              </Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Group
                className={clsx(classes.subtitleIcon, classes.groupIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Community goal
              </Typography>
            </div>
            <div className={classes.descriptionContainer}>
              <Typography variant="body2" color="textSecondary" paragraph>
                Tiramisu caramels jelly beans ice cream sesame snaps marshmallow
                lollipop pastry danish. Gummi bears oat cake donut cookie
                chocolate jelly jujubes. Muffin marzipan marshmallow danish oat
                cake. Chupa chups candy pastry.
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
          <CardActions>
            <Button color="default">Invite Friends</Button>
          </CardActions>
        </>
      )
      break
    case 'beehives':
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
                May 2
              </Typography>
            </div>
            <div className={classes.impactContainer}>
              <CheckCircle
                className={clsx(classes.statusIcon, classes.successColor)}
              />
              <Typography variant="h5">
                Funded 100 beehives in Nicaragua
              </Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <HowToAchieveIcon
                className={clsx(classes.subtitleIcon, classes.requirementsIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Open tabs
              </Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Group
                className={clsx(classes.subtitleIcon, classes.groupIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Community goal
              </Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <RemoveCircle
                className={clsx(classes.subtitleIcon, classes.skipIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                You skipped this goal
              </Typography>
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
                className={clsx(classes.statusIcon, classes.successColor)}
              />
              <Typography variant="h5">Planted 1 tree</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <HowToAchieveIcon
                className={clsx(classes.subtitleIcon, classes.requirementsIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Open 100 tabs
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
              May 8
            </Typography>
            <div className={classes.impactContainer}>
              <Cancel
                className={clsx(classes.statusIcon, classes.failureColor)}
              />
              <Typography variant="h5">Plant 1 tree</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <HowToAchieveIcon
                className={clsx(classes.subtitleIcon, classes.requirementsIcon)}
              />
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
                className={clsx(classes.statusIcon, classes.successColor)}
              />
              <Typography variant="h5">Gave 25,000 meals to kids</Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <HowToAchieveIcon
                className={clsx(classes.subtitleIcon, classes.requirementsIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Open tabs
              </Typography>
            </div>
            <div className={classes.subtitleContainer}>
              <Group
                className={clsx(classes.subtitleIcon, classes.groupIcon)}
              />
              <Typography variant="subtitle1" color="textSecondary">
                Community goal
              </Typography>
            </div>
            <div className={classes.descriptionContainer}>
              <Typography variant="body2" color="textSecondary" paragraph>
                Nearly 22 million low-income kids in the United States rely on
                the free and reduced-price meals they receive at school. With
                schools closed in districts nationwide, children may be left
                without that critical lifeline to healthy meals.
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                To help combat this, we supported No Kid Hungry in their efforts
                to make sure all children have access to nutritious meals
                throughout the crisis.
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

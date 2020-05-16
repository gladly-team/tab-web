import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import green from '@material-ui/core/colors/green'
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
}))

const ImpactGoal = (props) => {
  const { className, demo } = props
  const classes = useStyles()
  const bull = <span className={classes.bullet}>•</span>

  let content
  switch (demo) {
    case '100tabs':
      content = (
        <>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              variant="overline"
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
            <Button color="primary">Share</Button>
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
              variant="overline"
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
              variant="overline"
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
            <Button color="primary">Share</Button>
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

import React from 'react'
// import PropTypes from 'prop-types'
// import { graphql } from 'react-relay'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
// import withAuthAndData from 'src/utils/pageWrappers/withAuthAndData'
import ImpactGoal from 'src/components/ImpactGoal'

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    position: 'relative',
    width: '100%',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineBar: {
    position: 'absolute',
    zIndex: 10,
    height: 'calc(100% - 100px)',
    top: 40,
    width: 24,
    background: grey['300'],
  },
  timelineEnd: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    background: grey['300'],
    zIndex: 20,
    marginTop: 40,
  },
  timelineEndTextContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  timelineEndText: {
    lineHeight: '1.4em',
  },
  impactGoal: {
    width: '100%',
    maxWidth: 500,
    minWidth: 275,
    margin: theme.spacing(2),
    position: 'relative',
    zIndex: 100,
  },
}))

const Achievements = () => {
  const classes = useStyles()
  return (
    <SettingsPage>
      <div className={classes.contentContainer}>
        <div className={classes.timelineContainer}>
          <div className={classes.timelineBar} />
          <ImpactGoal className={classes.impactGoal} demo="tab7days" />
          <ImpactGoal className={classes.impactGoal} demo="100tabs" />
          <ImpactGoal className={classes.impactGoal} demo="recruitFriend" />
          <ImpactGoal className={classes.impactGoal} demo="meals" />
          <ImpactGoal className={classes.impactGoal} demo="default" />
          <ImpactGoal className={classes.impactGoal} demo="default" />
          <ImpactGoal className={classes.impactGoal} demo="default" />
          <div className={classes.timelineEnd} />
        </div>
        <div className={classes.timelineEndTextContainer}>
          <Typography
            variant="overline"
            align="center"
            className={classes.timelineEndText}
          >
            Joined Tab for a Cause
          </Typography>
          <Typography
            variant="overline"
            align="center"
            className={classes.timelineEndText}
          >
            January 1, 2020
          </Typography>
        </div>
      </div>
    </SettingsPage>
  )
}

Achievements.displayName = 'Achievements'
Achievements.propTypes = {}
Achievements.defaultProps = {}

export default Achievements

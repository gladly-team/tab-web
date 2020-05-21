import React from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Achievement from 'src/components/Achievement'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  header: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(4),
  },
  exampleSet: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: theme.spacing(2),
  },
  achievement: {
    margin: theme.spacing(2),
    width: 400,
  },
}))

const DemoAchievementComponent = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h3">Demos of Achievement Types</Typography>
        <Typography variant="body1">
          Each type in various states: in progress, success (recent), success
          (historical), failure (recent), and failure (historical).
        </Typography>
      </div>
      <Typography variant="h5">Individual achievement</Typography>
      <div className={classes.exampleSet}>
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="inProgress"
          taskText="Open 50 tabs"
          deadlineTime={moment().add(92, 'seconds').toISOString()}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="success"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(4, 'days').toISOString()}
          completionTime={moment().subtract(5, 'days').toISOString()}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="failure"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(5, 'months').toISOString()}
          completionTime={moment().subtract(5, 'months').toISOString()}
        />
      </div>
      <Typography variant="h5">
        Individual achievement (different completion times)
      </Typography>
      <div className={classes.exampleSet}>
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="inProgress"
          taskText="Open 50 tabs"
          deadlineTime={moment().add(40, 'days').toISOString()}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="success"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(2, 'years').toISOString()}
          completionTime={moment().subtract(3, 'years').toISOString()}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="failure"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(8, 'years').toISOString()}
          completionTime={moment().subtract(8, 'years').toISOString()}
        />
      </div>
    </div>
  )
}

DemoAchievementComponent.displayName = 'DemoAchievementComponent'
DemoAchievementComponent.propTypes = {}
DemoAchievementComponent.defaultProps = {}

export default DemoAchievementComponent

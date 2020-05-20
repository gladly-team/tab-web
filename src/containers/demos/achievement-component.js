import React from 'react'
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
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="success"
          taskText="Open 50 tabs"
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="failure"
          taskText="Open 50 tabs"
        />
      </div>
    </div>
  )
}

DemoAchievementComponent.displayName = 'DemoAchievementComponent'
DemoAchievementComponent.propTypes = {}
DemoAchievementComponent.defaultProps = {}

export default DemoAchievementComponent

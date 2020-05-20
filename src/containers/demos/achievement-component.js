import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}))

const DemoAchievementComponent = () => {
  const classes = useStyles()
  return <div className={classes.container}>TODO</div>
}

DemoAchievementComponent.displayName = 'DemoAchievementComponent'
DemoAchievementComponent.propTypes = {}
DemoAchievementComponent.defaultProps = {}

export default DemoAchievementComponent

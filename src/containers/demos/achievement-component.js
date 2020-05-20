import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Achievement from 'src/components/Achievement'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
}))

const DemoAchievementComponent = () => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <Achievement impactText="Plant 20 trees" taskText="Open 50 tabs" />
    </div>
  )
}

DemoAchievementComponent.displayName = 'DemoAchievementComponent'
DemoAchievementComponent.propTypes = {}
DemoAchievementComponent.defaultProps = {}

export default DemoAchievementComponent

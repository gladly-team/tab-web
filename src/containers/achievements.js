import React from 'react'
// import PropTypes from 'prop-types'
// import { graphql } from 'react-relay'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
// import withAuthAndData from 'src/utils/pageWrappers/withAuthAndData'

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    width: '100%',
    margin: theme.spacing(2),
  },
}))

const Achievements = () => {
  const classes = useStyles()
  return (
    <SettingsPage>
      <Paper elevation={1} className={classes.contentContainer}>
        <Typography variant="body2">To-do!</Typography>
      </Paper>
    </SettingsPage>
  )
}

Achievements.displayName = 'Achievements'
Achievements.propTypes = {}
Achievements.defaultProps = {}

export default Achievements

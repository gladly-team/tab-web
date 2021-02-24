import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStylesNotification = makeStyles(() => ({
  root: {
    position: 'absolute',
    padding: '15px',
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  button: {
    maxWidth: '78px',
  },
}))
const Notification = ({ buttonOnClick }) => {
  const classes = useStylesNotification()
  return (
    <Paper className={classes.root}>
      <Typography>
        You did it! You just turned your tab into a treat for a cat. Keep it up,
        and do good with every new tab!
      </Typography>
      <Button
        className={classes.button}
        size="small"
        variant="contained"
        color="primary"
        onClick={buttonOnClick}
      >
        Hooray!
      </Button>
    </Paper>
  )
}
Notification.displayName = 'Notification'
Notification.propTypes = {
  buttonOnClick: PropTypes.func,
}
Notification.defaultProps = {
  buttonOnClick: () => {},
}
export default Notification

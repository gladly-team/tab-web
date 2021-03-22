import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const useStylesNotification = makeStyles(() => ({
  root: {
    position: 'absolute',
    padding: '15px',
    marginTop: '10px',
    marginRight: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  button: {
    maxWidth: '78px',
  },
}))
const Notification = ({ buttonOnClick, text, buttonText, includeButton }) => {
  const classes = useStylesNotification()
  return (
    <Paper className={classes.root}>
      {text}
      {includeButton ? (
        <Button
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          onClick={buttonOnClick}
        >
          {buttonText}
        </Button>
      ) : null}
    </Paper>
  )
}
Notification.displayName = 'Notification'
Notification.propTypes = {
  buttonOnClick: PropTypes.func.isRequired,
  text: PropTypes.element.isRequired,
  buttonText: PropTypes.string.isRequired,
  includeButton: PropTypes.bool,
}
Notification.defaultProps = {
  includeButton: true,
}
export default Notification

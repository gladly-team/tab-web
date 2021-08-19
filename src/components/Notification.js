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
  buttons: {
    flexDirection: 'row',
  },
  secondaryButton: {
    marginRight: '8px',
  },
}))
const Notification = ({
  buttonOnClick,
  text,
  buttonText,
  includeButton,
  includeSecondaryButton,
  secondaryButtonText,
  secondaryButtonOnClick,
  open,
}) => {
  const classes = useStylesNotification()
  return open ? (
    <Paper className={classes.root}>
      {text}
      <div className="buttons">
        {includeSecondaryButton ? (
          <Button
            className={classes.secondaryButton}
            size="small"
            variant="outlined"
            color="primary"
            onClick={secondaryButtonOnClick}
          >
            {secondaryButtonText}
          </Button>
        ) : null}
        {includeButton ? (
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={buttonOnClick}
          >
            {buttonText}
          </Button>
        ) : null}
      </div>
    </Paper>
  ) : null
}
Notification.displayName = 'Notification'
Notification.propTypes = {
  buttonOnClick: PropTypes.func.isRequired,
  text: PropTypes.element.isRequired,
  buttonText: PropTypes.string.isRequired,
  includeButton: PropTypes.bool,
  includeSecondaryButton: PropTypes.bool,
  secondaryButtonText: PropTypes.string,
  secondaryButtonOnClick: PropTypes.func,
  open: PropTypes.bool,
}
Notification.defaultProps = {
  includeButton: true,
  includeSecondaryButton: false,
  secondaryButtonText: '',
  secondaryButtonOnClick: () => {},
  open: true,
}
export default Notification

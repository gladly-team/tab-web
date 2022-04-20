import React from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

const useStylesNotification = makeStyles(() => ({
  root: {
    // TODO: positioning and margin shouldn't be within a reusable component.
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
  buttonsProvided: {
    flexDirection: 'row',
    width: '100%',
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
  onClose,
  includeClose,
  buttons,
}) => {
  const classes = useStylesNotification()
  return open ? (
    <Paper className={classes.root}>
      {includeClose && (
        <IconButton
          onClick={onClose}
          style={{ position: 'absolute', right: '0px', top: '0px' }}
        >
          <CloseIcon />
        </IconButton>
      )}
      {text}
      {buttons ? (
        <div className={classes.buttonsProvided}>{buttons}</div>
      ) : (
        <div className={classes.buttons}>
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
      )}
    </Paper>
  ) : null
}
Notification.displayName = 'Notification'
Notification.propTypes = {
  /**
    Callback function that fires when user clicks main CTA button
  */
  buttonOnClick: PropTypes.func,

  /**
    HTML element centered in middle of notification responsible for body of notification texxt
  */
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,

  /**
    the label on main button
  */
  buttonText: PropTypes.string,

  /**
    manually remove having any cta button
  */
  includeButton: PropTypes.bool,

  /**
    second button left of main cta that uses secondary color
  */
  includeSecondaryButton: PropTypes.bool,

  /**
    secondary button label
  */
  secondaryButtonText: PropTypes.string,

  /**
    Callback function that fires when user clicks secondary button
  */
  secondaryButtonOnClick: PropTypes.func,

  /**
    Buttons provided by client. Overrides button and secondaryButton
  */
  buttons: PropTypes.element,

  /**
   boolean that literally shows or hides notification.  State of notification being opened is primarily controlled by parent component but can be used in some cases
   */
  open: PropTypes.bool,

  /**
    including this adds a close button to the top right that invokes the onClose callback when clicked
  */
  includeClose: PropTypes.bool,

  /**
    the onClose callback invoked when close button is clicked
  */
  onClose: PropTypes.func,
}
Notification.defaultProps = {
  buttonText: '',
  buttonOnClick: () => {},
  buttons: null,
  includeButton: true,
  includeSecondaryButton: false,
  secondaryButtonText: '',
  secondaryButtonOnClick: () => {},
  open: true,
  includeClose: false,
  onClose: () => {},
}
export default Notification

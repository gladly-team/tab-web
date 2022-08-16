import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import Notification from './Notification'

const useStyles = makeStyles((theme) => ({
  noButton: {
    height: '30px',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  yesButton: {
    background: '#29BEBA',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '900',
    fontFamily: 'Poppins',
    marginLeft: theme.spacing(1),
    color: 'white',
  },
  title: {
    fontWeight: '700',
    fontSize: '24px',
    fontFamily: 'Poppins',
  },
  text: {
    paddingBottom: theme.spacing(3.5),
    maxWidth: theme.spacing(56),
  },
  buttonsWrapper: {
    display: 'flex',
  },
}))
const SfacExtensionSellNotification = ({ onNo, onYes }) => {
  const [open, setOpen] = useState(true)
  const classes = useStyles()
  const onNoClick = () => {
    onNo()
    setOpen(false)
  }
  const onYesClick = () => {
    onYes()
    setOpen(false)
  }
  return (
    <div className={classes.wrapper}>
      <Notification
        open={open}
        text={
          <span className={classes.text}>
            <Typography className={classes.title}>
              Make a bigger impact
            </Typography>
            <Typography variant="body1">
              Turn your searches into money for causes with Search for a Cause.
              Like tabbing, it’s free and easy!
            </Typography>
          </span>
        }
        buttons={
          <div className={classes.buttonsWrapper}>
            <Button onClick={onNoClick} className={classes.noButton}>
              Maybe later
            </Button>
            <Button
              onClick={onYesClick}
              className={classes.yesButton}
              variant="contained"
              disableElevation
            >
              Let's do it!
            </Button>
          </div>
        }
      />
    </div>
  )
}

SfacExtensionSellNotification.propTypes = {
  onNo: PropTypes.func,
  onYes: PropTypes.func,
}

SfacExtensionSellNotification.defaultProps = {
  onNo: () => {},
  onYes: () => {},
}

export default SfacExtensionSellNotification

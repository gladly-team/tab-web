import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import CreateSfacExtensionPromptResponseMutation from 'src/utils/mutations/CreateSfacExtensionPromptResponseMutation'
import awaitTimeLimit from 'src/utils/awaitTimeLimit'
import { windowOpenTop } from 'src/utils/navigation'
import { GET_SEARCH_URL } from 'src/utils/urls'
import { AwaitedPromiseTimeout } from 'src/utils/errors'
import logger from 'src/utils/logger'
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
const SfacExtensionSellNotification = ({ browser, userId }) => {
  const [open, setOpen] = useState(true)
  const classes = useStyles()
  const onYesClick = useCallback(async () => {
    // Log the search event but time-cap how long we wait to avoid a bad UX
    // if the request hangs.
    try {
      const MS_TO_WAIT_FOR_LOG = 50
      await awaitTimeLimit(
        CreateSfacExtensionPromptResponseMutation(userId, browser, true),
        MS_TO_WAIT_FOR_LOG
      )
    } catch (e) {
      if (e.code !== AwaitedPromiseTimeout.code) {
        logger.error(e)
      }
    }
    setOpen(false)
    windowOpenTop(GET_SEARCH_URL)
  }, [userId, browser])
  const onNoClick = () => {
    CreateSfacExtensionPromptResponseMutation(userId, browser, false)
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
  browser: PropTypes.string,
  userId: PropTypes.string,
}

SfacExtensionSellNotification.defaultProps = {
  browser: PropTypes.string,
  userId: PropTypes.string,
}

export default SfacExtensionSellNotification

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
    paddingBottom: theme.spacing(2),
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))
const SfacExtensionSellNotification = ({ browser, className, userId }) => {
  const [open, setOpen] = useState(true)
  const classes = useStyles()
  const onYesClick = useCallback(async () => {
    // Log the search event but time-cap how long we wait to avoid a bad UX
    // if the request hangs.
    try {
      const MS_TO_WAIT_FOR_LOG = 1500
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
    <div className={className}>
      <Notification
        open={open}
        text={
          <span className={classes.text}>
            <Typography className={classes.title} gutterBottom>
              Make a bigger impact
            </Typography>
            <Typography variant="body1">
              We've just launched Search for a Cause, where you can turn your
              searches into money for nonprofits—up to 4x more than tabs alone!
              Like tabbing, it's free and easy. Will you try it out?
            </Typography>
          </span>
        }
        buttons={
          <div className={classes.buttonsWrapper}>
            <Button onClick={onNoClick} className={classes.noButton}>
              Dismiss
            </Button>
            <Button
              onClick={onYesClick}
              className={classes.yesButton}
              variant="contained"
              disableElevation
            >
              Try It Out
            </Button>
          </div>
        }
      />
    </div>
  )
}

SfacExtensionSellNotification.propTypes = {
  className: PropTypes.string,
  browser: PropTypes.string,
  userId: PropTypes.string,
}

SfacExtensionSellNotification.defaultProps = {
  browser: PropTypes.string,
  className: '',
  userId: PropTypes.string,
}

export default SfacExtensionSellNotification

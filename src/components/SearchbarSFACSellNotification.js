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
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft'; 

const useStyles = makeStyles((theme) => ({
  noButton: {
    height: '30px',
    fontWeight: '500',
  },
  yesButton: {
    background: '#29BEBA',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '900',
    marginLeft: theme.spacing(1),
    color: 'white',
  },
  title: {
    fontWeight: '700',
    fontSize: '24px',
  },
  text: {
    paddingBottom: theme.spacing(2),
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  arrow: {
    transform: 'rotate(90deg)'
  },
  firstText: {
    paddingBottom: theme.spacing(1)
  }, 
  blue: {
    background: '#4285F4',
    color: 'white'
  },
  red: {
    background: '#DB4437',
    color: 'white'
  },
  yellow: {
    background: '#F4B400',
    color: 'white'
  },
  green: {
    background: '#0F9D58',
    color: 'white'
  }
}))
const SearchbarSFACSellNotification = ({ browser, className, userId }) => {
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
            <Typography variant="h2" className={classes.title} gutterBottom>
              <SubdirectoryArrowLeftIcon className={classes.arrow}/> Your searches here could be doing good!
            </Typography>
            <Typography variant="body1" className={classes.firstText}>
              Search for a Cause, in partnership with Yahoo, turns searches into money for nonprofits.
            </Typography>
            <Typography variant="body1">
            Unlike That One Search Engine, we’re focused on doing good over maximizing profit.
            </Typography>
          </span>
        }
        buttons={
          <div className={classes.buttonsWrapper}>
            <Button onClick={onNoClick} className={classes.noButton}>
              Maybe Later
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

SearchbarSFACSellNotification.propTypes = {
  className: PropTypes.string,
  browser: PropTypes.string,
  userId: PropTypes.string,
}

SearchbarSFACSellNotification.defaultProps = {
  browser: PropTypes.string,
  className: '',
  userId: PropTypes.string,
}

export default SearchbarSFACSellNotification

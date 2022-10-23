import React, { useCallback, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import clsx from 'clsx'
import CreateSfacExtensionPromptResponseMutation from 'src/utils/mutations/CreateSfacExtensionPromptResponseMutation'
import awaitTimeLimit from 'src/utils/awaitTimeLimit'
import { windowOpenTop } from 'src/utils/navigation'
import { GET_SEARCH_URL } from 'src/utils/urls'
import { AwaitedPromiseTimeout } from 'src/utils/errors'
import logger from 'src/utils/logger'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import Notification from './Notification'

const useStyles = makeStyles((theme) => ({
  noButton: {
    fontWeight: '500',
  },
  yesButton: {
    fontWeight: '900',
    marginLeft: theme.spacing(1),
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
    transform: 'rotate(270deg)',
    position: 'absolute',
    backgroundColor: 'white',
    right: theme.spacing(-3.5),
    top: theme.spacing(-0.5),
    width: `${theme.spacing(5)}px !important`,
    height: `${theme.spacing(5)}px !important`,
    borderRadius: theme.spacing(5),
    padding: theme.spacing(0.5),
    border: '1px solid #D3D3D3',
  },
  firstText: {
    paddingBottom: theme.spacing(1),
  },
  blue: {
    background: '#4285F4',
    color: 'white',
  },
  red: {
    background: '#DB4437',
    color: 'white',
  },
  yellow: {
    background: '#F4B400',
    color: 'white',
  },
  green: {
    background: '#0F9D58',
    color: 'white',
  },
  mainDiv: {
    paddingRight: theme.spacing(3.5),
    paddingTop: theme.spacing(1),
  },
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
    <div className={clsx(className, classes.mainDiv)}>
      <Notification
        open={open}
        text={
          <span className={classes.text}>
            <Typography variant="h2" className={classes.title} gutterBottom>
              <SubdirectoryArrowRightIcon className={classes.arrow} /> Your
              searches here could be doing good!
            </Typography>
            <Typography variant="body1" className={classes.firstText}>
              Search for a Cause, in partnership with Yahoo, turns searches into
              money for nonprofits.
            </Typography>
            <Typography variant="body1">
              Unlike <span className={classes.blue}>That</span>{' '}
              <span className={classes.red}>One</span>{' '}
              <span className={classes.yellow}>Search</span>{' '}
              <span className={classes.green}>Engine</span>, we’re focused on
              doing good over maximizing profit.
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

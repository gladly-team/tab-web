import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import SetYahooSearchOptInMutation from 'src/utils/mutations/SetYahooSearchOptInMutation'
import CreateSearchEnginePromptLogMutation from 'src/utils/mutations/CreateSearchEnginePromptLogMutation'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import Notification from './Notification'

const useStyles = makeStyles((theme) => ({
  learnButton: {
    height: '30px',
    fontWeight: '900',
    fontFamily: 'Poppins',
  },
  noThanksButton: {
    marginLeft: 'auto',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '900',
    fontFamily: 'Poppins',
  },
  switchToYahooButton: {
    background: '#29BEBA',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '900',
    fontFamily: 'Poppins',
    marginLeft: theme.spacing(1),
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
const YahooSellNotification = ({
  onLearnMore,
  onNoThanks,
  onSwitchToYahoo,
  userId,
}) => {
  const [open, setOpen] = useState(true)
  const classes = useStyles()
  const onLearnMoreClick = () => {
    onLearnMore()
    setOpen(false)
  }
  const onNoThanksClick = () => {
    onNoThanks()
    setOpen(false)
  }
  const onSwitchToYahooClick = () => {
    SetUserSearchEngineMutation(userId, 'Yahoo')
    SetYahooSearchOptInMutation(userId, true)
    CreateSearchEnginePromptLogMutation(userId, 'Yahoo', true)
    onSwitchToYahoo()
    setOpen(false)
  }
  return (
    <div className={classes.wrapper}>
      <Notification
        open={open}
        text={
          <span className={classes.text}>
            <Typography className={classes.title}>
              Want to make a greater impact?
            </Typography>
            <Typography variant="body1">
              Increase your impact, and raise more money, with every search that
              you make with Yahoo!
            </Typography>
          </span>
        }
        buttons={
          <div className={classes.buttonsWrapper}>
            <Button onClick={onLearnMoreClick} className={classes.learnButton}>
              Learn More
            </Button>
            <Button
              onClick={onNoThanksClick}
              className={classes.noThanksButton}
              variant="outlined"
            >
              No Thanks
            </Button>
            <Button
              onClick={onSwitchToYahooClick}
              className={classes.switchToYahooButton}
              variant="contained"
              disableElevation
            >
              Switch to Yahoo
            </Button>
          </div>
        }
      />
    </div>
  )
}

YahooSellNotification.propTypes = {
  userId: PropTypes.string.isRequired,
  onLearnMore: PropTypes.func,
  onNoThanks: PropTypes.func,
  onSwitchToYahoo: PropTypes.func,
}

YahooSellNotification.defaultProps = {
  onLearnMore: () => {},
  onNoThanks: () => {},
  onSwitchToYahoo: () => {},
}

export default YahooSellNotification

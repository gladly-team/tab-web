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
    fontWeight: '500',
  },
  noThanksButton: {
    marginLeft: 'auto',
    fontWeight: '5ayw00',
  },
  switchToSearchForACauseButton: {
    marginLeft: theme.spacing(1),
  },
  title: {
    fontWeight: '700',
    fontSize: '24px',
  },
  text: {
    paddingBottom: theme.spacing(3.5),
    maxWidth: theme.spacing(56),
  },
  buttonsWrapper: {
    display: 'flex',
  },
}))
const SearchForACauseSellNotification = ({
  onLearnMore,
  onNoThanks,
  onSwitchToSearchForACause,
  userId,
}) => {
  const [open, setOpen] = useState(true)
  const classes = useStyles()
  const onLearnMoreClick = () => {
    onLearnMore()
    setOpen(false)
  }
  const onNoThanksClick = () => {
    CreateSearchEnginePromptLogMutation(userId, 'SearchForACause', false)
    onNoThanks()
    setOpen(false)
  }
  const onSwitchToSearchForACauseClick = () => {
    SetUserSearchEngineMutation(userId, 'SearchForACause')
    SetYahooSearchOptInMutation(userId, true)
    CreateSearchEnginePromptLogMutation(userId, 'SearchForACause', true)
    onSwitchToSearchForACause()
    setOpen(false)
  }
  return (
    <div className={classes.wrapper}>
      <Notification
        open={open}
        text={
          <span className={classes.text}>
            <Typography variant="h2" className={classes.title}>
              Want to make a greater impact?
            </Typography>
            <Typography variant="body1">
              Increase your impact, and raise more money, with every search that
              you make with Search for a Cause!
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
              onClick={onSwitchToSearchForACauseClick}
              className={classes.switchToSearchForACauseButton}
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

SearchForACauseSellNotification.propTypes = {
  userId: PropTypes.string.isRequired,
  onLearnMore: PropTypes.func,
  onNoThanks: PropTypes.func,
  onSwitchToSearchForACause: PropTypes.func,
}

SearchForACauseSellNotification.defaultProps = {
  onLearnMore: () => {},
  onNoThanks: () => {},
  onSwitchToSearchForACause: () => {},
}

export default SearchForACauseSellNotification

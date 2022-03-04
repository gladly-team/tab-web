import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import yahooSell from 'src/assets/images/yahooSell.png'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import SetYahooSearchOptInMutation from 'src/utils/mutations/SetYahooSearchOptInMutation'
import SetUserSearchEngineMutation from 'src/utils/mutations/SetUserSearchEngineMutation'
import CreateSearchEnginePromptLogMutation from 'src/utils/mutations/CreateSearchEnginePromptLogMutation'

const useStyles = makeStyles((theme) => ({
  popoverContent: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: theme.spacing(50),
    background: 'white',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(3),
  },
  acceptButton: {
    background: '#29BEBA',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '800',
    fontFamily: 'Poppins',
    marginLeft: theme.spacing(1),
    color: 'white',
  },
  declineButton: {
    marginLeft: 'auto',
    borderRadius: '15px',
    height: '30px',
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  buttons: {
    width: '100%',
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  title: {
    fontWeight: '700',
  },
}))

const YahooSellModal = ({ hardSell, userId, onAccept, onDecline }) => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  const declineSearchOptIn = useCallback(() => {
    CreateSearchEnginePromptLogMutation(userId, 'Yahoo', false)
    onDecline()
    setOpen(false)
  }, [userId, onDecline])
  const acceptSearchOptIn = useCallback(() => {
    SetYahooSearchOptInMutation(userId, true)
    SetUserSearchEngineMutation(userId, 'Yahoo')
    CreateSearchEnginePromptLogMutation(userId, 'Yahoo', true)
    onAccept()
    setOpen(false)
  }, [userId, onAccept])
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false)
      }}
    >
      <div className={classes.popoverContent}>
        <img src={yahooSell} alt="search engine" height="255px" width="355px" />
        <Typography className={classes.title} variant="h6">
          {hardSell
            ? "You'll love having more impact."
            : 'Do even more good, for free'}
        </Typography>
        <Typography variant="body2">
          Increase your impact, and raise more money, with every search that you
          make with Yahoo! It’s completely free.
        </Typography>
        <div className={classes.buttons}>
          <Button
            className={classes.declineButton}
            variant="outlined"
            onClick={declineSearchOptIn}
          >
            I don't want more impact
          </Button>
          <Button
            className={classes.acceptButton}
            variant="contained"
            onClick={acceptSearchOptIn}
          >
            Let's Do It!
          </Button>
        </div>
      </div>
    </Modal>
  )
}

YahooSellModal.propTypes = {
  hardSell: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
}

YahooSellModal.defaultProps = {
  onAccept: () => {},
  onDecline: () => {},
}

export default YahooSellModal

import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import searchForACauseSell from 'src/assets/images/searchForACauseSell.png'
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
    fontWeight: '800',
    marginLeft: theme.spacing(1),
  },
  declineButton: {
    marginLeft: 'auto',
    fontWeight: '500',
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
  modal: {
    zIndex: '100000000 !important',
  },
}))

const SearchForACauseSellModal = ({
  hardSell,
  userId,
  onAccept,
  onDecline,
  onClose,
  open,
}) => {
  const classes = useStyles()
  const [isOpen, setIsOpen] = useState(true)
  const declineSearchOptIn = useCallback(() => {
    CreateSearchEnginePromptLogMutation(userId, 'SearchForACause', false)
    onDecline()
    onClose()
  }, [userId, onDecline, onClose])
  const acceptSearchOptIn = useCallback(() => {
    SetYahooSearchOptInMutation(userId, true)
    SetUserSearchEngineMutation(userId, 'SearchForACause')
    CreateSearchEnginePromptLogMutation(userId, 'SearchForACause', true)
    onAccept()
    onClose()
  }, [userId, onAccept, onClose])

  useEffect(() => {
    setIsOpen(isOpen)
  }, [isOpen])
  return (
    <Modal className={classes.modal} open={open} onClose={onClose}>
      <div className={classes.popoverContent}>
        <img
          src={searchForACauseSell}
          alt="search engine"
          height="255px"
          width="355px"
        />
        <Typography className={classes.title} variant="h6">
          {hardSell
            ? "You'll love having more impact."
            : 'Do even more good, for free'}
        </Typography>
        <Typography variant="body2">
          Increase your impact, and raise more money, with every search that you
          make with Search for a Cause! It’s completely free.
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

SearchForACauseSellModal.propTypes = {
  hardSell: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
}

SearchForACauseSellModal.defaultProps = {
  onAccept: () => {},
  onDecline: () => {},
  onClose: () => {},
}

export default SearchForACauseSellModal

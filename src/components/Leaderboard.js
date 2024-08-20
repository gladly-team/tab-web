import React, { useState, useEffect } from 'react'
import gtag from 'ga-gtag'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const iframeUrl = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/v5/leaderboard?user_id=`

const Leaderboard = ({ user, openWidgetFunc, onCloseFunc }) => {
  const [openWidget, setOpenWidget] = useState(false)

  const onOpen = () => {
    setOpenWidget(true)
    gtag('event', 'leaderboard_open')
  }

  const onClose = () => {
    setOpenWidget(false)
    onCloseFunc()
    gtag('event', 'leaderboard_close')
  }

  //
  // Function to handle received messages from the iframe
  //
  function receiveMessage(event) {
    // TODO(spicer): Add origin check for added security
    // if (event.origin !== 'http://127.0.0.1:9000') return

    // Check if the message is for us. If not, ignore it.
    if (typeof event.data.show === 'undefined') return

    // Check if the message is for us. If not, ignore it.
    if (event.data.slot !== 'leaderboard') {
      return
    }

    // If the message from iframe to close.
    if (!event.data.show) {
      onClose()
    }
  }

  // Set up the event listener
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-undef
    window.addEventListener(
      'message',
      (event) => {
        receiveMessage(event)
      },
      false
    )
  }

  // If you need to call the function automatically when the parent says so:
  useEffect(() => {
    if (openWidgetFunc) {
      onOpen()
    }
  }, [openWidgetFunc])

  if (!user) {
    return null
  }

  return (
    <>
      {iframeUrl && (
        <Modal
          id="leaderboard-modal"
          open={openWidget}
          style={{
            top: 10,
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 800,
            bottom: 10,
            position: 'absolute',
            backgroundColor: 'white',
            zIndex: 100000000,
          }}
        >
          <div style={{ height: '100%' }}>
            <IconButton
              onClick={onClose}
              style={{ position: 'absolute', right: 25, top: 5 }}
            >
              <CloseIcon sx={{ color: '#fff', width: 28, height: 28 }} />
            </IconButton>

            <div
              style={{
                height: '100%',
                width: '100%',
                padding: 40,
                backgroundColor: 'white',
                display: 'flex',
                flexFlow: 'column',
              }}
            >
              <iframe
                style={{ border: 'none', flex: '1 1 auto' }}
                id="leaderboard-iframe"
                title="Leaderboard Widget"
                src={iframeUrl + user.userId}
                width="100%"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

Leaderboard.displayName = 'LeaderboardComponent'

Leaderboard.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
  }).isRequired,
  openWidgetFunc: PropTypes.func,
  onCloseFunc: PropTypes.func,
}

Leaderboard.defaultProps = {
  openWidgetFunc: () => {},
  onCloseFunc: () => {},
}

export default Leaderboard

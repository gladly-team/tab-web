'use client'

import gtag from 'ga-gtag'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

// Example Overrides: ?opt-in-override={any user id}
const OptInVideo = ({ user }) => {
  const [showModal, setShowModal] = useState(false)

  // User is not loaded yet.
  if (!user) {
    return null
  }

  // Not a browser, so we can't render the widget.
  if (typeof window === 'undefined') {
    return null
  }

  //
  // Called when widget is closed by user.
  //
  const onClose = () => {
    setShowModal(false)
    gtag('event', 'optin-video_modal_close')
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
    if (event.data.slot !== 'opt-in-video') {
      return
    }

    // Do we want to show the notification?
    if (event.data.show) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }

  // Set up the event listener
  // eslint-disable-next-line no-undef
  window.addEventListener(
    'message',
    (event) => {
      receiveMessage(event)
    },
    false
  )

  return (
    <>
      <Modal
        id="optin-video-modal"
        open={showModal}
        style={{
          height: 650,
          maxWidth: 1000,
          marginTop: 'auto',
          marginBottom: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          position: 'absolute',
          backgroundColor: '#fff',
          zIndex: 100000000,
          overflow: 'hidden',
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
              padding: 0,
              backgroundColor: 'white',
              display: 'flex',
              flexFlow: 'column',
            }}
          >
            <iframe
              id="optin-video-modal-iframe"
              src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/v5/iframe/opt-in-video?user_id=${user.userId}`}
              title="optin-video-modal-iframe"
              style={{
                border: 'none',
              }}
              width="100%"
              height="100%"
              frameBorder="0"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

OptInVideo.displayName = 'OptInVideoComponent'

OptInVideo.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
  }).isRequired,
}

OptInVideo.defaultProps = {}

export default OptInVideo

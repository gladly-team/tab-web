import React, { useEffect, useState } from 'react'
import gtag from 'ga-gtag'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import localStorageMgr from 'src/utils/localstorage-mgr'
import { NOTIF_DISMISS_PREFIX } from 'src/utils/constants'

const iframeBaseUrl =
  'https://tab.gladly.io/promos/prime-day-day-2023/?nolayout=true'

const contStyles = {
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 600,
  marginTop: 0,
  marginBottom: 60,
  zIndex: 100000,
}

const PrimeDay2023 = ({ user }) => {
  const [show, setShow] = useState(false)
  const [openWidget, setOpenWidget] = useState(false)
  const [iframeUrl, setIframeUrl] = useState(false)

  const getNotifDismissKey = (code) => `${NOTIF_DISMISS_PREFIX}.${code}`

  const onOpen = () => {
    setOpenWidget(true)
    gtag('event', 'prime_day_2023_open_promo')
  }

  const onClose = () => {
    setOpenWidget(false)
    gtag('event', 'prime_day_2023_close_promo')
  }

  const onDismiss = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    gtag('event', 'prime_day_2023_dismiss')
    localStorageMgr.setItem(getNotifDismissKey('mothers-day-2023'), true)
    setShow(false)
    return false
  }

  useEffect(() => {
    setIframeUrl(
      `${iframeBaseUrl}&cause_name=${user.cause.nameForShop}&user_id=${user.userId}`
    )

    const dissNotif =
      localStorageMgr.getItem(getNotifDismissKey('prime-day-2023')) || false

    if (!dissNotif) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [user])

  return (
    <>
      {show && (
        <div style={contStyles}>
          <Card>
            <CardContent
              onClick={onOpen}
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <IconButton
                onClick={onDismiss}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: 0,
                }}
              >
                <CloseIcon sx={{ color: '#fff', width: 28, height: 28 }} />
              </IconButton>

              <Typography
                variant="h4"
                gutterBottom
                align="center"
                style={{ marginTop: 20 }}
              >
                Mother's Day Is Almost Here!
              </Typography>

              <Typography variant="body1" gutterBottom align="center">
                8 great gift suggestions that will also raise money for{' '}
                {user.cause.nameForShop || 'Charity'}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  width: 250,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Click to Shop and Raise
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {iframeUrl && (
        <Modal
          open={openWidget}
          style={{
            top: 20,
            left: 40,
            right: 40,
            bottom: 20,
            position: 'absolute',
            backgroundColor: 'transparent',
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

            <iframe
              title="Widget Content"
              src={iframeUrl}
              width="100%"
              height="100%"
            />
          </div>
        </Modal>
      )}
    </>
  )
}

PrimeDay2023.displayName = 'PrimeDay2023Component'

PrimeDay2023.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    cause: PropTypes.shape({
      nameForShop: PropTypes.string,
    }),
  }).isRequired,
}

PrimeDay2023.defaultProps = {}

export default PrimeDay2023

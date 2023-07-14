import React, { useState } from 'react'
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

const iframeUrl =
  'https://tab-for-a-cause-360.givemomentum.com?background-color=red&show-container=false'

const contStyles = {
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 650,
  marginTop: 0,
  marginBottom: 60,
  zIndex: 100000,
}

const Momentum = ({ user }) => {
  const [show, setShow] = useState(true)
  const [openWidget, setOpenWidget] = useState(false)

  const getNotifDismissKey = (code) => `${NOTIF_DISMISS_PREFIX}.${code}`

  const onOpen = () => {
    setOpenWidget(true)
    gtag('event', 'momentum_open')
  }

  const onClose = () => {
    setOpenWidget(false)
    gtag('event', 'momentum_close')
  }

  const onDismiss = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    gtag('event', 'momentum_dismiss')
    localStorageMgr.setItem(getNotifDismissKey('momentum'), true)
    setShow(false)
    return false
  }

  // useEffect(() => {
  //   const dissNotif =
  //     localStorageMgr.getItem(getNotifDismissKey('momentum')) || false

  //   if (!dissNotif) {
  //     setShow(true)
  //   } else {
  //     setShow(false)
  //   }
  // }, [user])

  return (
    <>
      {show && (
        <div style={contStyles}>
          <script src="https://donation-form-static.givemomentum.com/widget.js" />
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
                Donate Directly to {user.cause.nameForShop || 'Charity'}
              </Typography>
              <Typography variant="body1" gutterBottom align="center">
                By donating directly, 100% of your funds goes to supporting{' '}
                {user.cause.nameForShop || 'Charity'}.
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
                Donate Directly
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {iframeUrl && (
        <Modal
          open={openWidget}
          style={{
            top: 100,
            left: 100,
            right: 100,
            bottom: 100,
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
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                style={{ marginTop: 20, flex: '0 1 auto' }}
              >
                Level Up Your Impact For {user.cause.nameForShop || 'Charity'}.
              </Typography>
              <Typography variant="body1" gutterBottom align="center">
                By donating directly, 100% of your funds goes to supporting{' '}
                {user.cause.nameForShop || 'Charity'}.
              </Typography>
              <iframe
                style={{ border: 'none', flex: '1 1 auto' }}
                id="momentum-donation-form"
                title="Widget Content"
                src={iframeUrl}
                width="100%"
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

Momentum.displayName = 'MomentumComponent'

Momentum.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    cause: PropTypes.shape({
      nameForShop: PropTypes.string,
    }),
  }).isRequired,
}

Momentum.defaultProps = {}

export default Momentum

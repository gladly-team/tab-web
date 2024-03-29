import React, { useEffect, useState } from 'react'
import gtag from 'ga-gtag'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import localStorageMgr from 'src/utils/localstorage-mgr'
import { windowOpenTop } from 'src/utils/navigation'
import { NOTIF_DISMISS_PREFIX } from 'src/utils/constants'

const contStyles = {
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 700,
  marginTop: 10,
  marginBottom: 20,
  zIndex: 100000,
}

const November2023NoShopUser = ({ user }) => {
  const [show, setShow] = useState(false)

  const getNotifDismissKey = (code) => `${NOTIF_DISMISS_PREFIX}.${code}`

  const onDismiss = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    gtag('event', 'november_2023_no_shop_user_dismiss')
    localStorageMgr.setItem(getNotifDismissKey('november-2023-no-shop'), true)
    setShow(false)
    return false
  }

  const buttonClick = () => {
    gtag('event', 'november_2023_no_shop_user_button_click')
    windowOpenTop('http://shop.gladly.io')
  }

  useEffect(() => {
    const dissNotif =
      localStorageMgr.getItem(getNotifDismissKey('november-2023-no-shop')) ||
      false

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
                variant="h6"
                gutterBottom
                align="center"
                style={{ marginTop: 20 }}
              >
                Win $100 by Giving Back during Black Friday and Cyber Monday
              </Typography>

              <Typography variant="body2" gutterBottom align="center">
                Double your impact when you shop this holiday season with{' '}
                <a
                  href="http://shop.gladly.io"
                  target="_blank"
                  rel="noreferrer"
                >
                  Shop for a Cause
                </a>
                . Simply add the extension, activate the offers, and shop. As a
                bonus for activating an offer, you’ll be entered into a drawing
                for one of two $100 Visa gift cards (
                <a
                  href="https://gladly.zendesk.com/hc/en-us/articles/21341815958541-Black-Friday-2023-100-Gift-Card-Giveaway-Details"
                  target="_blank"
                  rel="noreferrer"
                >
                  promo details
                </a>
                ).
              </Typography>

              <Button
                onClick={buttonClick}
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
                Install Shop for a Cause
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

November2023NoShopUser.displayName = 'November2023NoShopUserComponent'

November2023NoShopUser.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    cause: PropTypes.shape({
      nameForShop: PropTypes.string,
    }),
  }).isRequired,
}

November2023NoShopUser.defaultProps = {}

export default November2023NoShopUser

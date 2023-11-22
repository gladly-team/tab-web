import Box from '@material-ui/core/Box'
import React, { useEffect, useState } from 'react'
import gtag from 'ga-gtag'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import localStorageMgr from 'src/utils/localstorage-mgr'
import { NOTIF_DISMISS_PREFIX } from 'src/utils/constants'

import LegoLogo from 'src/assets/promos/lego.png'
import WalmartLogo from 'src/assets/promos/walmart.png'
import SephoraLogo from 'src/assets/promos/sephora.png'
import ThriftBooksLogo from 'src/assets/promos/thriftbooks.png'
import KiwicoLogo from 'src/assets/promos/kiwico.png'
import SamsungLogo from 'src/assets/promos/samsung.png'
import SonosLogo from 'src/assets/promos/sonos.png'
import horseLogo from 'src/assets/promos/horse.png'
import allExpressLogo from 'src/assets/promos/allexpress.png'
import glossierLogo from 'src/assets/promos/glossier.png'
import bookshopLogo from 'src/assets/promos/bookshop.png'
import lowesLogo from 'src/assets/promos/lowes.png'

import styles from './November2023ShopUser.module.css'

const batchKey = 'november-2023-shop-batch'
const baseUrl = 'https://wild.link/e?d=20397233'

const contStyles = {
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 750,
  marginTop: 10,
  marginBottom: 20,
  zIndex: 100000,
}

const imageGroupStyles = {
  display: 'flex',
  justifyContent: 'space-evenly',
  marginTop: 20,
}

const November2023ShopUser = ({ user }) => {
  const [show, setShow] = useState(false)
  const [batch, setBatch] = useState(1)

  useEffect(() => {
    // Function to update the state
    function updateState() {
      const now = new Date().getTime()
      const storedData = localStorageMgr.getItem(batchKey)

      if (storedData) {
        const { timestamp, currentState } = JSON.parse(storedData)

        // Calculate the number of 3-min intervals passed since the timestamp
        const intervalsPassed = Math.floor((now - timestamp) / (3 * 60 * 1000))

        if (intervalsPassed > 0) {
          // Calculate the new state based on intervals passed
          const newState = ((currentState + intervalsPassed - 1) % 4) + 1
          const newTimestamp = timestamp + intervalsPassed * 3 * 60 * 1000

          // Update local storage and state
          localStorageMgr.setItem(
            batchKey,
            JSON.stringify({ timestamp: newTimestamp, currentState: newState })
          )
          setBatch(newState)
        } else {
          // If less than 3 min have passed, keep the current state
          setBatch(currentState)
        }
      } else {
        // If no data in local storage, set default state and store it
        const defaultData = { timestamp: now, currentState: 1 }
        localStorageMgr.setItem(batchKey, JSON.stringify(defaultData))
        setBatch(1)
      }
    }

    // Call the function on component mount
    updateState()
  }, [])

  const getNotifDismissKey = (code) => `${NOTIF_DISMISS_PREFIX}.${code}`

  const onDismiss = (e) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    gtag('event', 'november_2023_shop_user_dismiss')
    localStorageMgr.setItem(getNotifDismissKey('november-2023-shop'), true)
    setShow(false)
    return false
  }

  useEffect(() => {
    const dissNotif =
      localStorageMgr.getItem(getNotifDismissKey('november-2023-shop')) || false

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
                padding: 5,
                paddingBottom: 15,
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
                variant="h5"
                gutterBottom
                align="center"
                style={{ marginTop: 20 }}
              >
                Give back during your Holiday Shopping
              </Typography>

              <Typography variant="body2" gutterBottom align="center">
                Raise money for {user.cause.nameForShop || 'Charity'} when you
                shop these Black Friday deals–you can earn up to 10% back! As a
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

              {batch === 1 && (
                <Box sx={imageGroupStyles}>
                  <a
                    href={`${baseUrl}&c=5482116&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.lego.com/')}`}
                    className={styles.hoverable}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={LegoLogo} alt="Lego" />
                  </a>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5483936&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.walmart.com/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={WalmartLogo} alt="Walmart" />
                  </a>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5481985&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.sephora.com/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={SephoraLogo} alt="Sephora" />
                  </a>
                </Box>
              )}

              {batch === 2 && (
                <Box sx={imageGroupStyles}>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5475597&tc=${
                      user.userId
                    }&url=${encodeURIComponent(
                      'https://www.backcountry.com/'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={horseLogo} width="100" alt="BackCountry" />
                  </a>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=144406&tc=${
                      user.userId
                    }&url=${encodeURIComponent(
                      'https://www.thriftbooks.com/'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={ThriftBooksLogo} width="100" alt="ThriftBooks" />
                  </a>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5475228&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.aliexpress.us/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={allExpressLogo} width="100" alt="AliExpress" />
                  </a>
                </Box>
              )}

              {batch === 3 && (
                <Box sx={imageGroupStyles}>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5479361&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.kiwico.com/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={KiwicoLogo} alt="Kiwico" />
                  </a>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5481855&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.samsung.com/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={SamsungLogo} alt="Samsung" />
                  </a>{' '}
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5482453&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.sonos.com/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={SonosLogo} alt="Sonos" />
                  </a>{' '}
                </Box>
              )}

              {batch === 4 && (
                <Box sx={imageGroupStyles}>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5478249&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.glossier.com/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={glossierLogo} width="100" alt="Glossier" />
                  </a>
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=145193&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://bookshop.org/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={bookshopLogo} width="100" alt="BookShop" />
                  </a>{' '}
                  <a
                    className={styles.hoverable}
                    href={`${baseUrl}&c=5479801&tc=${
                      user.userId
                    }&url=${encodeURIComponent('https://www.lowes.com/')}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src={lowesLogo} width="100" alt="Lowes" />
                  </a>{' '}
                </Box>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

November2023ShopUser.displayName = 'November2023ShopUserComponent'

November2023ShopUser.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    cause: PropTypes.shape({
      nameForShop: PropTypes.string,
    }),
  }).isRequired,
}

November2023ShopUser.defaultProps = {}

export default November2023ShopUser

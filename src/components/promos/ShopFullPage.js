import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import localStorageMgr from 'src/utils/localstorage-mgr'
import { NOTIF_DISMISS_PREFIX } from 'src/utils/constants'
import gtag from 'ga-gtag'

const promoKey = 'shop-full-page-2023'
const isBrowser = typeof window !== 'undefined'
const iframeBaseUrl = 'https://tab.gladly.io/promos/full-page-shop-2023/'

const params = {
  version: null,
}

if (isBrowser) {
  // eslint-disable-next-line no-undef
  const p = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  params.version = p.version || null
}

const ShopFullPage = ({ user, variation }) => {
  const [show, setShow] = useState(false)
  const [version, setVersion] = useState(variation)
  const getNotifDismissKey = (code) => `${NOTIF_DISMISS_PREFIX}.${code}`

  // On close
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onClose = () => {
    setShow(false)
    localStorageMgr.setItem(getNotifDismissKey(promoKey), true)
    gtag('event', 'shop_full_page_2023_dismiss', { version })
  }

  // Set version
  useEffect(() => {
    if (params.version) {
      setVersion(params.version)
    }
  }, [variation])

  // This hook is listening an event that came from the Iframe
  useEffect(() => {
    const dissNotif =
      localStorageMgr.getItem(getNotifDismissKey(promoKey)) || false

    if (!dissNotif) {
      setShow(true)
    } else {
      setShow(false)
    }

    // iframe message handler.
    const handler = (ev) => {
      if (ev.data !== 'close') return
      onClose()
    }

    // eslint-disable-next-line no-undef
    window.addEventListener('message', handler)

    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('message', handler)
  }, [onClose, user])

  if (version !== 'Version2' && version !== 'Version3') {
    return null
  }

  return (
    <Modal open={show} style={{ zIndex: 100000000, backgroundColor: '#fff' }}>
      <div style={{ height: '100%' }}>
        <IconButton
          onClick={onClose}
          style={{ position: 'absolute', right: 25, top: 5 }}
        >
          <CloseIcon sx={{ color: '#fff', width: 28, height: 28 }} />
        </IconButton>

        <iframe
          title="Widget Content"
          src={`${iframeBaseUrl}?cause_name=${user.cause.nameForShop}&user_id=${user.userId}&version=${version}`}
          width="100%"
          height="100%"
        />
      </div>
    </Modal>
  )
}

ShopFullPage.displayName = 'ShopFullPage'

ShopFullPage.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    cause: PropTypes.shape({
      nameForShop: PropTypes.string,
    }),
  }).isRequired,
  variation: PropTypes.string.isRequired,
}

ShopFullPage.defaultProps = {}

export default ShopFullPage

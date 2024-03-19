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
import { NOTIF_DISMISS_PREFIX } from '../utils/constants'

const iframeUrl =
  'https://tab-for-a-cause-360.givemomentum.com?show-container=false'

const contStyles = {
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 650,
  marginTop: 10,
  marginBottom: 20,
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

  if (user.cause.nameForShop !== 'Ending Poverty') {
    return null
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
        <div style={contStyles} id="momentum-container">
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

              {user.cause.nameForShop === 'Ending Poverty' && (
                <>
                  <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    style={{ marginTop: 20 }}
                  >
                    Send life-changing cash directly <br /> to someone in
                    poverty
                  </Typography>
                  <Typography variant="body1" gutterBottom align="center">
                    Cash transfers empower people in extreme poverty to choose
                    how best to <br /> improve their lives (check out their{' '}
                    <a
                      href="https://www.npr.org/2024/01/10/1197956397/give-directly-universal-basic-income-poverty-kenya"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Planet Money
                    </a>{' '}
                    feature). Giving cash is effective, evidence-backed, and
                    empowering. Will you join our group of Tabbers amplifying
                    this impact with a monthly cash donation?
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
                    I want to help!
                  </Button>
                </>
              )}

              {user.cause.nameForShop === 'Shelter Cats' && (
                <>
                  <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    style={{ marginTop: 20 }}
                  >
                    Automatically Help <br /> Even More Shelter Cats
                  </Typography>
                  <Typography variant="body1" gutterBottom align="center">
                    We’re putting together a team of shelter cat heroes that are
                    willing to chip in $1 each time a shelter cat is put up for
                    adoption on Petfinder. The money raised will go directly to{' '}
                    <a
                      href="https://greatergood.org/jackson-galaxy#catpawsitive"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Greater Good
                    </a>{' '}
                    and will work to ensure 1000s of shelter cats have better
                    lives!
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
                    Join the Team
                  </Button>
                </>
              )}

              {user.cause.nameForShop === 'Reproductive Health' && (
                <>
                  <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    style={{ marginTop: 20 }}
                  >
                    Help Fight For <br /> Reproductive Health Rights
                  </Typography>
                  <Typography variant="body1" gutterBottom align="center">
                    We’re putting together a team to fight for reproductive
                    rights by chipping in a few dollars directly to the{' '}
                    <a
                      href="https://reproductiverights.org"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Center for Reproductive Rights
                    </a>{' '}
                    each time new anti-abortion legislation is proposed. Let’s
                    make it clear where the public stands on access to
                    reproductive healthcare and help disincentivize proposing
                    these harmful bills.
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
                    Join the Team
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {iframeUrl && (
        <Modal
          id="momentum-modal"
          open={openWidget}
          style={{
            top: 100,
            left: 0,
            right: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 1200,
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
                {user.cause.nameForShop === 'Ending Poverty' && (
                  <>Pledge a monthly donation to people in poverty.</>
                )}
              </Typography>

              {user.cause.nameForShop === 'Ending Poverty' && (
                <Typography variant="body1" gutterBottom align="center">
                  100% of your donation will support GiveDirectly’s work to
                  deliver cash directly to families in need, no strings
                  attached. <br /> A donation of just $20/month for a year could
                  help a family buy a plot of land, install a pump for clean
                  water, build a home, or more.
                </Typography>
              )}
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

import * as React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const iframeUrl = 'http://localhost:8002/promos/mothers-day-2023?nolayout=true'

const contStyles = {
  position: 'relative',
  marginLeft: 'auto',
  marginRight: 'auto',
  width: 600,
  height: 30,
  marginTop: 150,
  marginBottom: -200,
  zIndex: 10000,
}

const MothersDay2023 = ({ user }) => {
  const [openWidget, setOpenWidget] = React.useState(false)

  const onOpen = () => {
    setOpenWidget(true)
  }

  const onClose = () => {
    setOpenWidget(false)
  }

  const url = `${iframeUrl}&cause_name=${user.cause.nameForShop}&user_id=${user.userId}`

  return (
    <>
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
            <Typography variant="h4" gutterBottom align="center">
              Mother's Day Is Almost Here!
            </Typography>

            <Typography variant="body1" gutterBottom align="center">
              Want to find a special mother a perfect gift and raise money for{' '}
              {user.cause.nameForShop}?
            </Typography>

            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              Click Here to Learn More
            </Button>
          </CardContent>
        </Card>
      </div>

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

          <iframe title="Widget Content" src={url} width="100%" height="100%" />
        </div>
      </Modal>
    </>
  )
}

MothersDay2023.displayName = 'MothersDay2023Component'

MothersDay2023.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.string,
    cause: PropTypes.shape({
      nameForShop: PropTypes.string,
    }),
  }).isRequired,
}

MothersDay2023.defaultProps = {}

export default MothersDay2023

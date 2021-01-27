import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isNil } from 'lodash/lang'
import moment from 'moment'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'

const USER_BACKGROUND_OPTION_DAILY = 'daily'
const UserBackgroundImage = ({ user }) => {
  const { backgroundImage: imageURL } = user
  const useStyles = makeStyles(() => ({
    background: {
      boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 120px inset',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      WebkitBackgroundSize: 'cover',
      MozBackgroundSize: 'cover',
      backgroundSize: 'cover',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 'auto',
      backgroundImage: imageURL
        ? `url(${user.backgroundImage.imageURL})`
        : 'none',
      backgroundColor: !imageURL ? '#4a90e2' : undefined,
    },
  }))
  const getNewDailyImageIfNeeded = ({
    backgroundImage: { timestamp },
    backgroundOption,
    id,
  }) => {
    if (backgroundOption !== USER_BACKGROUND_OPTION_DAILY || isNil(timestamp)) {
      return
    }
    // Check if today is a different day (in local time) than
    // the last time the background image changed.
    const shouldChangeBackgroundImg = !moment()
      .local()
      .startOf('day')
      .isSame(moment(timestamp).local().startOf('day'))
    if (shouldChangeBackgroundImg) {
      SetBackgroundDailyImageMutation(id)
    }
  }
  useEffect(() => {
    getNewDailyImageIfNeeded(user)
  }, [user])
  const classes = useStyles()
  return <div className={classes.background} />
}
export default UserBackgroundImage

UserBackgroundImage.propTypes = {
  user: PropTypes.shape({
    backgroundImage: PropTypes.shape({
      imageURL: PropTypes.string,
      timestamp: PropTypes.string,
    }),
    backgroundOption: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
}

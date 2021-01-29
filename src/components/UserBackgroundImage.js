import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isNil } from 'lodash/lang'
// switch to dayjs
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import { get } from 'lodash/object'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'
import Fade from '@material-ui/core/Fade'

// const FadeWrapper = ({ children }) => (
  
//     {children}
  
// )
dayjs.extend(isToday)
const useStyles = makeStyles(() => ({
  background: {
    boxShadow: 'rgba(0, 0, 0, 0.5) 0px 0px 120px inset',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 'auto',
    backgroundImage: ({ user }) =>
      user.backgroundImage.imageURL
        ? `url(${user.backgroundImage.imageURL})`
        : 'none',
    // backgroundColor: !imageURL ? '#4a90e2' : undefined,
  },
  tint: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 'auto',
    // Needs to match shading in extension new tab page.
    backgroundColor: `rgba(0, 0, 0, 0.15)`,
  },
}))
const USER_BACKGROUND_OPTION_DAILY = 'daily'
const UserBackgroundImage = ({ user }) => {
  console.log(JSON.stringify(user), 'data called does it dif')
  const {
    backgroundImage: { timestamp: backgroundImageTimestamp, imageURL },
    id: userId,
  } = user
  const getNewDailyImageIfNeeded = (timestamp, id) => {
    // console.log(timestamp, id, 'my timestamp and id change')
    if (isNil(timestamp)) {
      return
    }
    // by default dayjs displays in local time and compares in local
    const shouldChangeBackgroundImg = !dayjs(timestamp).isToday()
    if (shouldChangeBackgroundImg) {
      console.log(shouldChangeBackgroundImg, 'fired inside of image mutation')
      SetBackgroundDailyImageMutation(id)
    }
  }
  useEffect(() => {
    getNewDailyImageIfNeeded(backgroundImageTimestamp, userId)
  }, [backgroundImageTimestamp, userId])
  //talk to kevin about this
  const classes = useStyles({ user })
  return (
    <div>
      <Fade in out timeout={2000}>
        <div className={classes.background} key={imageURL} />
      </Fade>
      <div data-test-id={'background-tint-overlay'} className={classes.tint} />
    </div>
  )
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
  }),
}
UserBackgroundImage.defaultProps = {
  user: {
    backgroundImage: {
      imageURL: '',
      timestamp: '',
    },
    backgroundOption: 'daily',
    id: '',
  },
}

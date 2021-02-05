import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@material-ui/core/styles'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'

dayjs.extend(isToday)
const useStyles = makeStyles(() => ({
  // '@keyframes fadeIn': {
  //   from: { opacity: 0 },
  //   to: { opacity: 1 },
  // },
  // fade: {
  //   animation: '$fadeIn 0.5s ease',
  // },
  image: {
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
    // backgroundImage: ({ user }) =>
    //   get(user, 'backgroundImage.imageURL', undefined)
    //     ? `url(${user.backgroundImage.imageURL})`
    //     : 'none',
  },
  tint: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 'auto',
    backgroundColor: `rgba(0, 0, 0, 0.15)`,
  },
}))
const UserBackgroundImage = ({ user }) => {
  const {
    backgroundImage: { timestamp: backgroundImageTimestamp, imageURL },
    id: userId,
  } = user
  useEffect(() => {
    // Show a new background image every day.
    if (
      isNil(backgroundImageTimestamp) ||
      !dayjs(backgroundImageTimestamp).isToday()
    ) {
      SetBackgroundDailyImageMutation(userId)
    }
  }, [backgroundImageTimestamp, userId])
  const classes = useStyles()

  // Debugging
  // eslint-disable-next-line no-console
  console.log('user:', user)
  // eslint-disable-next-line no-console
  console.log('imageURL:', imageURL)

  return (
    <CSSTransition appear in timeout={2000} classNames="background-img">
      <div>
        <div
          className={classes.image}
          key={imageURL}
          style={{
            backgroundImage: get(user, 'backgroundImage.imageURL', undefined)
              ? `url(${user.backgroundImage.imageURL})`
              : 'none',
          }}
        />
        <div className={classes.tint} />
      </div>
    </CSSTransition>
  )
}
export default UserBackgroundImage

UserBackgroundImage.propTypes = {
  user: PropTypes.shape({
    backgroundImage: PropTypes.shape({
      imageURL: PropTypes.string,
      timestamp: PropTypes.string,
    }),
    id: PropTypes.string.isRequired,
  }).isRequired,
}

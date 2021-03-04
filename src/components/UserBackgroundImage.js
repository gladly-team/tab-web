import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'
import { recachePage } from 'src/utils/caching'
import usePrevious from 'src/utils/hooks/usePrevious'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
// import 'src/utils/styles/componentStyles.css'

dayjs.extend(isToday)
const useStyles = makeStyles(() => ({
  hiddenImage: {
    visibility: 'hidden',
  },
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
    backgroundImage: ({ originalImage }) =>
    originalImage ? `url(${originalImage})` : 'none',
  },
  newBackground: {
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
    backgroundImage: ({ newImage }) =>
    newImage ? `url(${newImage})` : 'none',
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
  const [originalImage] = useState(imageURL)
  const [newImage, setNewImage] = useState(false)

  const fireOnLoad = () => {
    setNewImage(imageURL)
    // setShowBackground(true)
  }
  useEffect(() => {
    // Show a new background image every day.
    async function updateBackgroundAndCachePage() {
      await SetBackgroundDailyImageMutation(userId)
      // setShowBackground(false)
      await recachePage()
    }
    if (
      isNil(backgroundImageTimestamp) ||
      !dayjs(backgroundImageTimestamp).isToday()
    ) {
      updateBackgroundAndCachePage()
    }
  }, [backgroundImageTimestamp, userId])
  const classes = useStyles({ originalImage, newImage })
  return (
    <div>
      <img
        src={imageURL}
        alt="background"
        className={classes.hiddenImage}
        onLoad={fireOnLoad}
      />
      {/* <TransitionGroup enter exit> */}
      <div >
          <div className={classes.background} />
          <div className={classes.tint} />
        </div>
        <CSSTransition in={newImage} appear timeout={2000} classNames="my-node" >
        {newImage && <div >
          <div className={classes.newBackground} />
          <div className={classes.tint} />
        </div>}
        </CSSTransition>
      {/* </TransitionGroup> */}
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
    id: PropTypes.string.isRequired,
  }).isRequired,
}

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

dayjs.extend(isToday)
const useStyles = makeStyles(() => ({
  hiddenImage: {
    display: 'none',
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
    backgroundImage: ({ user }) =>
      get(user, 'backgroundImage.imageURL', undefined)
        ? `url(${user.backgroundImage.imageURL})`
        : 'none',
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
  const imgRef = useRef(null)
  const [showBackground, setShowBackground] = useState(true)
  const previousImage = usePrevious(imageURL)
  useEffect(() => {
    // Show a new background image every day.

    async function updateBackgroundAndCachePage() {
      await SetBackgroundDailyImageMutation(userId)
      await recachePage()
    }
    if (
      isNil(backgroundImageTimestamp) ||
      !dayjs(backgroundImageTimestamp).isToday()
    ) {
      updateBackgroundAndCachePage()
    }
  }, [backgroundImageTimestamp, userId])
  useEffect(() => {
    // Show a new background image every day.
    if (
      previousImage !== undefined &&
      imageURL !== previousImage &&
      imgRef &&
      imgRef.current &&
      imgRef.current.complete
    ) {
      setShowBackground(false)
    }
  }, [imageURL, previousImage])

  if (
    imgRef &&
    imgRef.current &&
    imgRef.current.complete &&
    showBackground === false
  ) {
    setShowBackground(true)
  }
  console.log(showBackground, imgRef.current)
  const classes = useStyles({ user })
  return (
    <div>
      <img
        ref={imgRef}
        src={imageURL}
        alt="background"
        className={classes.hiddenImage}
      />
      {showBackground && (
        <>
          <div className={classes.background} key={imageURL} />
          <div className={classes.tint} />
        </>
      )}
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

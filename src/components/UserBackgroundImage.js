import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isNil } from 'lodash/lang'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'
import { recachePage } from 'src/utils/caching'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

dayjs.extend(isToday)
const useStyles = makeStyles(() => ({
  hiddenImage: {
    visibility: 'hidden',
  },
  previousImage: {
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
    backgroundImage: ({ previousImage }) =>
      previousImage ? `url(${previousImage.imageURL})` : 'none',
  },
  latestImage: {
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
    backgroundImage: ({ latestImage }) =>
      latestImage ? `url(${latestImage.imageURL})` : 'none',
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
  const [backgroundImages, setBackgroundImages] = useState([
    { imageURL, preloaded: true },
  ])

  const fireOnLoad = () => {
    setBackgroundImages((prevState) => [
      prevState[prevState.length - 2],
      { ...prevState[prevState.length - 1], preloaded: true },
    ])
  }
  useEffect(() => {
    // Show a new background image every day.
    async function updateBackgroundAndCachePage() {
      const {
        setUserBkgDailyImage: {
          user: {
            // eslint-disable-next-line no-shadow
            backgroundImage: { imageURL },
          },
        },
      } = await SetBackgroundDailyImageMutation(userId)
      setBackgroundImages((prevImages) => [
        ...prevImages,
        { imageURL, preloaded: false },
      ])
      await recachePage()
    }
    if (
      isNil(backgroundImageTimestamp) ||
      !dayjs(backgroundImageTimestamp).isToday()
    ) {
      updateBackgroundAndCachePage()
    }
  }, [backgroundImageTimestamp, userId])
  const previousImage = backgroundImages[0]
  const latestImage = backgroundImages[backgroundImages.length - 1]
  const classes = useStyles({ previousImage, latestImage })

  return (
    <div>
      <img
        src={latestImage.imageURL}
        alt="background"
        className={classes.hiddenImage}
        onLoad={fireOnLoad}
      />
      <TransitionGroup>
        {backgroundImages.map((img, index) =>
          img.imageURL ? (
            <CSSTransition
              key={img.imageURL}
              appear
              timeout={2000}
              classNames="my-node"
            >
              <div>
                <div
                  className={
                    classes[index === 0 ? 'previousImage' : 'latestImage']
                  }
                />
                <div className={classes.tint} />
              </div>
            </CSSTransition>
          ) : undefined
        )}
        <div>
          <div className={classes.background} />
          <div className={classes.tint} />
        </div>
      </TransitionGroup>
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

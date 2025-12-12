import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { isNil } from 'lodash/lang'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'
import { recachePage } from 'src/utils/caching'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import clsx from 'clsx'

// Use a stable class name.
// @workaround/mui-v5
// MUI class names are not stable by default, and we're seeing
// the class name change during rerender, causing the fade-in
// animation run more than once; not great. MUI changes styling
// in v5, so rather than debug and fix now, we'll defer until then.
const wrapperClassName = 'bg-img-wrapper'

dayjs.extend(isToday)
const useStyles = makeStyles(() => ({
  hiddenImage: {
    visibility: 'hidden',
    height: '1%',
    width: '1%',
  },
  backgroundImage: {
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
  },
  backgroundColor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 'auto',
    backgroundColor: ({ backgroundColor }) => backgroundColor || '#000',
  },
  previousImage: {
    backgroundImage: ({ previousImage }) =>
      previousImage ? `url(${previousImage.imageURL})` : 'none',
  },
  latestImage: {
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
  backgroundImageEnter: {
    opacity: 0,
  },
  backgroundImageEnterActive: {
    opacity: 1,
    transition: 'opacity 1000ms',
  },
  backgroundImageExit: {
    opacity: 1,
  },
  backgroundImageExitActive: {
    opacity: 0,
    transition: 'opacity 1000ms',
  },
}))

/**
 * Renders the user's background - either a solid color or an image.
 * If backgroundConfig.type is 'color', displays the specified color.
 * Otherwise, displays the daily rotating background image.
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing background settings
 * @returns {JSX.Element} Background component
 */
const UserBackgroundImage = ({ user }) => {
  const {
    backgroundImage: { timestamp: backgroundImageTimestamp, imageURL },
    backgroundConfig,
    id: userId,
  } = user

  // Check if we should render a solid color background
  const isColorBackground = backgroundConfig?.type === 'color'

  const [backgroundImages, setBackgroundImages] = useState([
    { imageURL, preloaded: true },
  ])

  const fireOnLoad = () => {
    if (backgroundImages.length > 1) {
      setBackgroundImages((prevState) => [
        prevState[prevState.length - 2],
        { ...prevState[prevState.length - 1], preloaded: true },
      ])
    }
  }
  useEffect(() => {
    // Show a new background image every day.
    async function updateBackgroundAndCachePage() {
      const {
        setUserBkgDailyImage: {
          user: {
            backgroundImage: { imageURL: updatedImageURL },
          },
        },
      } = await SetBackgroundDailyImageMutation(userId)
      setBackgroundImages((prevImages) => {
        const newImage = { imageURL: updatedImageURL, preloaded: false }
        return prevImages.length > 1
          ? [prevImages[1], newImage]
          : [prevImages[0], newImage]
      })
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
  const classes = useStyles({
    previousImage,
    latestImage,
    backgroundColor: backgroundConfig?.color,
  })

  // Render solid color background if backgroundConfig.type is 'color'
  if (isColorBackground) {
    return (
      <div className={wrapperClassName}>
        <div className={classes.backgroundColor} />
        <div className={classes.tint} />
      </div>
    )
  }

  // Render image background (default behavior)
  return (
    <div className={wrapperClassName}>
      <img
        src={latestImage.imageURL}
        alt="background"
        className={classes.hiddenImage}
        onLoad={fireOnLoad}
      />
      <TransitionGroup>
        {backgroundImages.map((img, index) =>
          img.imageURL && img.preloaded ? (
            <CSSTransition
              key={img.imageURL}
              in
              timeout={1000}
              enter={index > 0}
              classNames={{
                enter: classes.backgroundImageEnter,
                enterActive: classes.backgroundImageEnterActive,
                exit: classes.backgroundImageExit,
                exitActive: classes.backgroundImageExitActive,
              }}
            >
              <div>
                <div
                  className={clsx(
                    classes.backgroundImage,
                    classes[index === 0 ? 'previousImage' : 'latestImage']
                  )}
                />
                <div className={classes.tint} />
              </div>
            </CSSTransition>
          ) : undefined
        )}
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
    backgroundConfig: PropTypes.shape({
      type: PropTypes.string,
      color: PropTypes.string,
    }),
    id: PropTypes.string.isRequired,
  }).isRequired,
}

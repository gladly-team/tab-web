import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash/lang'
import { get } from 'lodash/object'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import SetBackgroundDailyImageMutation from 'src/utils/mutations/SetBackgroundDailyImageMutation'
// import styles from './UserBackgroundImage.module.css'

dayjs.extend(isToday)

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

  // Debugging
  // eslint-disable-next-line no-console
  console.log('user:', user)
  // eslint-disable-next-line no-console
  console.log('imageURL:', imageURL)

  return (
    <div className="fade">
      <div
        key={imageURL}
        className="image"
        style={{
          backgroundImage: get(user, 'backgroundImage.imageURL', undefined)
            ? `url(${user.backgroundImage.imageURL})`
            : 'none',
        }}
      />
      <div className="tint" />
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

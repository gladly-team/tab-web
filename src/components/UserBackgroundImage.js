import React from 'react'
import PropTypes from 'prop-types'
// place holder component for the next PR
const UserBackgroundImage = ({ user }) => {
  // temporary
  console.log(user, 'props in userBackground')
  return <div />
}
export default UserBackgroundImage

UserBackgroundImage.propTypes = {
  user: PropTypes.shape({
    backgroundImage: PropTypes.shape({
      imageUrl: PropTypes.string,
      timestamp: PropTypes.string,
    }),
    id: PropTypes.string,
  }).isRequired,
}

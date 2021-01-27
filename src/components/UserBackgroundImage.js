import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

const UserBackgroundImage = ({ user }) => {
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
      backgroundImage: `url(${user.backgroundImage.imageURL})`,
    },
  }))
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
    id: PropTypes.string,
  }).isRequired,
}

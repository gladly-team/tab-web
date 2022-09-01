import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'
import SearchIcon from '@material-ui/icons/Search'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import IconButton from '@material-ui/core/IconButton'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'

const useStyles = makeStyles(() => ({
  badgeContent: {
    position: 'absolute',
    maxWidth: '20px',
    maxHeight: '20px',
    background: '#fff',
    borderRadius: '20px',
  },
  button: {
    borderRadius: '30px',
    maxWidth: '52px',
    maxHeight: '52px',
    color: '#fff',
  },
  inactive: {
    color: '#E3720E',
  },
  active: {
    color: '#219653',
  },
}))

const SfacActivityButton = ({ active, onClick }) => {
  const classes = useStyles()

  return (
    <Badge
      overlap="circular"
      badgeContent={
        active ? (
          <CheckCircleIcon
            className={`${classes.badgeContent} ${classes.active}`}
          />
        ) : (
          <DoNotDisturbOnIcon
            className={`${classes.badgeContent} ${classes.inactive}`}
          />
        )
      }
    >
      <IconButton className={classes.button} onClick={onClick}>
        <SearchIcon />
      </IconButton>
    </Badge>
  )
}

SfacActivityButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
}

SfacActivityButton.defaultProps = {}

export default SfacActivityButton

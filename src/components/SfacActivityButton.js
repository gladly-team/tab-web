import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Badge from '@material-ui/core/Badge'
import SearchIcon from '@material-ui/icons/Search'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import IconButton from '@material-ui/core/IconButton'
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn'

const badgeSize = 18

const useStyles = makeStyles((theme) => ({
  badgeContent: {
    position: 'absolute',
    fontSize: badgeSize,
    background: theme.palette.common.white,
    borderRadius: '50%',
  },
  button: {
    borderRadius: '50%',
    height: 40,
    width: 40,

    // Button color theming gets easier in MUI v5:
    // https://stackoverflow.com/a/69836010/1332513
    backgroundColor: `${theme.palette.common.white} !important`,
    '&:hover': {
      background: 'white',
    },

    // Ideally, we should use standard MUI styling.
    boxShadow: '0px 2px 4px grey',
  },
  inactive: {
    color: '#E3720E',
  },
  active: {
    color: '#219653',
  },
  searchIcon: {
    // Matches current impact counter text.
    color: theme.palette.text.primary,
  },
}))

const SfacActivityButton = forwardRef(({ active, onClick }, ref) => {
  const classes = useStyles()

  return (
    <Badge
      ref={ref}
      overlap="circular"
      badgeContent={
        active ? (
          <CheckCircleIcon
            style={{ width: badgeSize, height: badgeSize }}
            className={clsx(classes.badgeContent, classes.active)}
          />
        ) : (
          <DoNotDisturbOnIcon
            style={{ width: badgeSize, height: badgeSize }}
            className={clsx(classes.badgeContent, classes.inactive)}
          />
        )
      }
    >
      <IconButton className={classes.button} onClick={onClick}>
        <SearchIcon className={classes.searchIcon} />
      </IconButton>
    </Badge>
  )
})

SfacActivityButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
}

SfacActivityButton.defaultProps = {}

export default SfacActivityButton

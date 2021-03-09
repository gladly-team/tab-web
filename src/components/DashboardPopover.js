import React from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  popoverStyle: {
    width: '100%',
    height: 3,
    backgroundColor: 'white',
  },
}))
const DashboardPopover = (props) => {
  const { anchorEl, onClose, open, className, children } = props
  const classes = useStyles()
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'center', vertical: 'top' }}
      className={className}
    >
      <div className={classes.popoverStyle} />
      {children}
    </Popover>
  )
}

DashboardPopover.propTypes = {
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  className: PropTypes.string,
}

DashboardPopover.defaultProps = {
  open: false,
  anchorEl: undefined,
  onClose: undefined,
  className: 'default',
  children: undefined,
}

export default DashboardPopover

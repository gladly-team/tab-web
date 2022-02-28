import React from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  root: {
    zIndex: '10000000 !important',
  },
  popoverStyle: {
    width: '100%',
    height: 3,
    backgroundColor: 'white',
  },
}))
const DashboardPopover = (props) => {
  const { anchorEl, onClose, open, className, children, popoverClasses } = props
  const classes = useStyles()
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      classes={popoverClasses}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'center', vertical: 'top' }}
      className={clsx(classes.root, className)}
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
  // eslint-disable-next-line react/forbid-prop-types
  popoverClasses: PropTypes.object,
}

DashboardPopover.defaultProps = {
  anchorEl: undefined,
  children: undefined,
  onClose: undefined,
  open: false,
  className: 'default',
  popoverClasses: undefined,
}

export default DashboardPopover

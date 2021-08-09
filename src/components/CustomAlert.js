import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import DoneIcon from '@material-ui/icons/Done'
import Typography from '@material-ui/core/Typography'

const customAlertUseStyles = makeStyles((theme) => ({
  wrapper: {
    borderRadius: '4px',
    minHeight: '32px',
    border: `1px solid`,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.background,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
  text: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '14px',
    marginLeft: theme.spacing(2),
  },
}))
const CustomAlert = ({ text, icon }) => {
  const cx = customAlertUseStyles()
  return (
    <div className={cx.wrapper}>
      {icon === 'done' && <DoneIcon color="primary" />}
      {icon === 'star' && <StarBorderIcon color="primary" />}
      <Typography classes={{ root: cx.text }}>{text}</Typography>
    </div>
  )
}

CustomAlert.displayName = 'CustomAlert'
CustomAlert.propTypes = {
  /**
    the icon to show, can be done or star
  */
  icon: PropTypes.oneOf(['star', 'done']),

  /**
    the text to show
  */
  text: PropTypes.string.isRequired,
}
CustomAlert.defaultProps = {
  icon: 'star',
}
export default CustomAlert

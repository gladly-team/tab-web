import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import NextJsLink from 'next/link'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  anchor: {
    display: 'inline-block',
    color: 'inherit',
    textDecoration: 'none',
  },
}))

const Link = (props) => {
  const { children, className, to } = props
  const classes = useStyles()

  return (
    <NextJsLink href={to}>
      <a className={clsx(classes.anchor, className)}>{children}</a>
    </NextJsLink>
  )
}

Link.displayName = 'Link'

Link.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
  to: PropTypes.string.isRequired,
}

Link.defaultProps = {
  className: '',
}

export default Link

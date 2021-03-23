import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import NextJsLink from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { isURLForDifferentApp } from 'src/utils/navigationUtils'

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
  const [destInternal, setDestInternal] = useState(true)

  useEffect(() => {
    if (isURLForDifferentApp(to)) {
      // Set that we can render the Firebase auth UI.
      setDestInternal(false)
    }
  }, [to])

  return (
    <NextJsLink href={to}>
      <a
        target={destInternal ? undefined : '_top'}
        className={clsx(classes.anchor, className)}
      >
        {children}
      </a>
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

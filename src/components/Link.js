import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import NextJsLink from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { isURLForDifferentApp, withBasePath } from 'src/utils/navigationUtils'

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

  // We won't always server-render the "target" prop correctly.
  // If that causes problems, use the URL from the request when
  // server-side rendering.
  useEffect(() => {
    // "When linking to other pages using next/link and next/router
    // the basePath will be automatically applied."
    // https://nextjs.org/docs/api-reference/next.config.js/basepath#links
    const url = withBasePath(to)
    if (isURLForDifferentApp(url)) {
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

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import NextJsLink from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { isURLForDifferentApp, withBasePath } from 'src/utils/navigationUtils'

const useStyles = makeStyles(() => ({
  anchor: {
    color: 'inherit',
    textDecoration: 'none',
  },
}))

const Link = (props) => {
  const { children, className, target, to = '', style } = props
  const classes = useStyles()
  const [destInternal, setDestInternal] = useState(true)

  // Explicitly set target="_top" for external links, because our
  // app may be served in an iframe.
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

  // Always use the anchor prop, if provided; otherwise, fall
  // back to the default.
  let anchorTarget
  if (target) {
    anchorTarget = target
  } else {
    anchorTarget = destInternal ? undefined : '_top'
  }

  return (
    <NextJsLink href={to}>
      <a
        target={anchorTarget}
        className={clsx(classes.anchor, className)}
        style={style}
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
  target: PropTypes.string,

  // Allow object type for style.
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.object,
}

Link.defaultProps = {
  className: '',
  target: undefined,
  style: {},
}

export default Link

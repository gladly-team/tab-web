import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import NextJsLink from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import { withBasePath } from 'src/utils/urls'

const useStyles = makeStyles(() => ({
  anchor: {
    display: 'block',
    color: 'inherit',
    textDecoration: 'none',
  },
}))

const Link = props => {
  const { children, className, to } = props
  const classes = useStyles()

  // We're disabling prefetch because it's broken by using
  // an app subpath: see now.json "rewrites" and comments in
  // urls.js. We can reenable prefetching after Next.js supports
  // a "basePath" option.
  // https://github.com/zeit/next.js/issues/4998#issuecomment-464345554
  // We set the "as" parameter to fix client-side routing. This is a
  // workaround for the missing "basePath" functionality:
  // https://github.com/zeit/next.js/issues/4998#issuecomment-520888814
  // @area/workaround/next-js-base-path
  return (
    <NextJsLink href={to} as={withBasePath(to)} prefetch={false}>
      <a className={clsx(classes.anchor, className)}>{children}</a>
    </NextJsLink>
  )
}

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

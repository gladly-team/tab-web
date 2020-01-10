/* eslint react/jsx-props-no-spreading: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import NextJsLink from 'next/link'

const Link = props => {
  const { children, to, ...otherProps } = props

  // We're disabling prefetch because it's broken by using
  // an app subpath: see now.json "rewrites" and comments in
  // urls.js. We can reenable prefetching after Next.js supports
  // a "basePath" option.
  // https://github.com/zeit/next.js/issues/4998#issuecomment-464345554
  return (
    <NextJsLink href={to} {...otherProps} prefetch={false}>
      {children}
    </NextJsLink>
  )
}

Link.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  to: PropTypes.string.isRequired,
}

Link.defaultProps = {}

export default Link

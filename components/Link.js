/* eslint react/jsx-props-no-spreading: 0 */

import React from 'react'
import PropTypes from 'prop-types'
import NextJsLink from 'next/link'

const Link = props => {
  const { children, to, ...otherProps } = props
  return (
    <NextJsLink href={to} {...otherProps}>
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

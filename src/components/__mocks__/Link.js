import React from 'react'
import PropTypes from 'prop-types'

const MockLink = ({ children, target, to }) => (
  <a data-test-id="mock-link" target={target} href={to}>
    {children}
  </a>
)

MockLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  target: PropTypes.string,
  to: PropTypes.string.isRequired,
}

MockLink.defaultProps = {
  target: undefined,
}

export default MockLink

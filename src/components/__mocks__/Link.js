import React from 'react'
import PropTypes from 'prop-types'

const MockLink = ({ children }) => (
  <div data-test-id="mock-link">
    <a>{children}</a>
  </div>
)

MockLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

MockLink.defaultProps = {}

export default MockLink

import React from 'react'
import PropTypes from 'prop-types'

const MockNextLink = ({ children }) => (
  <div data-test-id="mock-next-js-link">{children}</div>
)
MockNextLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default MockNextLink

import React from 'react'
import PropTypes from 'prop-types'

const MockSettingsPage = ({ children }) => (
  <div data-test-id="mock-settings-page">{children}</div>
)

MockSettingsPage.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

MockSettingsPage.defaultProps = {}

export default MockSettingsPage

import React from 'react'
// import PropTypes from 'prop-types'
import SettingsPage from 'src/components/SettingsPage'

const Account = () => {
  return (
    <SettingsPage
      mainContent={<div>hi</div>}
      sidebarContent={<div>sidebar here</div>}
      onClose={() => {}}
    />
  )
}

Account.displayName = 'Account'
Account.propTypes = {}
Account.defaultProps = {}

export default Account

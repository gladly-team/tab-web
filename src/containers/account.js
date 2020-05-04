import React from 'react'
// import PropTypes from 'prop-types'
import SettingsPage from 'src/components/SettingsPage'

const Account = () => {
  return (
    <SettingsPage onClose={() => {}}>
      <div>hi</div>
    </SettingsPage>
  )
}

Account.displayName = 'Account'
Account.propTypes = {}
Account.defaultProps = {}

export default Account

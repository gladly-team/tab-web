import React from 'react'
import PropTypes from 'prop-types'

const MoneyRaised = props => {
  const {
    app: { moneyRaised },
  } = props

  // TODO
  const moneyRaisedFormatted = moneyRaised
  return <span>{moneyRaisedFormatted}</span>
}

MoneyRaised.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
    dollarsPerDayRate: PropTypes.number.isRequired,
  }).isRequired,
}
MoneyRaised.defaultProps = {}

export default MoneyRaised

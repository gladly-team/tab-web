import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { get } from 'lodash/object'

const useStyles = makeStyles((theme) => ({
  currencyText: { color: get(theme, 'palette.backgroundContrastText.main') },
}))
const UserImpact = ({ userImpact }) => {
  const classes = useStyles()
  return (
    <span className={classes.currencyText}>{userImpact.userImpactMetric}</span>
  )
}

UserImpact.displayName = 'UserImpact'
UserImpact.propTypes = {
  userImpact: PropTypes.shape({
    visitsUntilNextImpact: PropTypes.number.isRequired,
    pendingUserReferralImpact: PropTypes.number.isRequired,
    userImpactMetric: PropTypes.number.isRequired,
    confirmedImpact: PropTypes.bool.isRequired,
  }).isRequired,
}
UserImpact.defaultProps = {}

export default UserImpact

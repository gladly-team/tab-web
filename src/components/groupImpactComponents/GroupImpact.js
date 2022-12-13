import React from 'react'
import PropTypes from 'prop-types'
import GroupImpactSidebar from 'src/components/groupImpactComponents/GroupImpactSidebar'

const GroupImpact = ({ groupImpactMetric }) => (
  <div>
    <GroupImpactSidebar
      badgeText=""
      groupImpactMetric={groupImpactMetric}
      open={false}
    />
  </div>
)

GroupImpact.propTypes = {
  groupImpactMetric: PropTypes.shape({
    dollarProgress: PropTypes.number.isRequired,
    dollarGoal: PropTypes.number.isRequired,
    impactMetric: PropTypes.shape({
      impactTitle: PropTypes.string.isRequired,
      whyValuableDescription: PropTypes.string.isRequired,
    }),
  }).isRequired,
}

GroupImpact.defaultProps = {}

export default GroupImpact

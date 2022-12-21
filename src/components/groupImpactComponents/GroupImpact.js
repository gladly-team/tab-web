import React from 'react'
import PropTypes from 'prop-types'
import GroupImpactSidebar from 'src/components/groupImpactComponents/GroupImpactSidebar'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localstorageManager from 'src/utils/localstorage-mgr'
import { COMPLETED_GROUP_IMPACT_VIEWS } from 'src/utils/constants'
import Celebration from '../Confetti'

const GroupImpact = ({ groupImpactMetric }) => {
  const lastGroupImpactMetric =
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric()
  let displayCelebration = false

  if (
    lastGroupImpactMetric &&
    lastGroupImpactMetric.id !== groupImpactMetric.id
  ) {
    const views =
      parseInt(localstorageManager.getItem(COMPLETED_GROUP_IMPACT_VIEWS), 10) ||
      0
    if (views === 0) {
      displayCelebration = true
    }
  }

  return (
    <div>
      {displayCelebration && <Celebration />}
      <GroupImpactSidebar
        badgeText=""
        groupImpactMetric={groupImpactMetric}
        open={false}
      />
    </div>
  )
}

GroupImpact.propTypes = {
  groupImpactMetric: PropTypes.shape({
    id: PropTypes.string.isRequired,
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

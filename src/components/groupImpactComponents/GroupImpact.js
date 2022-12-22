import React from 'react'
import PropTypes from 'prop-types'
import GroupImpactSidebar from 'src/components/groupImpactComponents/GroupImpactSidebar'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localStorageManager from 'src/utils/localstorage-mgr'
import {
  COMPLETED_GROUP_IMPACT_VIEWS,
  CURRENT_GROUP_IMPACT_VIEWS,
} from 'src/utils/constants'
import Celebration from '../Confetti'

const impactStateAndBadgeText = {
  NORMAL: '',
  NEW: 'NEW',
  COMPLETED: 'COMPLETED',
}
const COMPLETED_VIEWS_BEFORE_NEW = 3
const NEW_VIEWS_BEFORE_NORMAL = 3

const GroupImpact = ({ groupImpactMetric }) => {
  const lastGroupImpactMetric =
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric()
  let displayCelebration = false
  let sidebarMode = impactStateAndBadgeText.NORMAL
  const differentGoal =
    lastGroupImpactMetric && lastGroupImpactMetric.id !== groupImpactMetric.id

  const beginNewGoal = () => {
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      groupImpactMetric
    )
    localStorageManager.setItem(COMPLETED_GROUP_IMPACT_VIEWS, 0)
    localStorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 0)
  }

  if (differentGoal) {
    sidebarMode = impactStateAndBadgeText.COMPLETED
    const completedViews = localStorageManager.getNumericItem(
      COMPLETED_GROUP_IMPACT_VIEWS,
      0
    )
    if (completedViews === 0) {
      displayCelebration = true
    }

    if (completedViews >= COMPLETED_VIEWS_BEFORE_NEW) {
      beginNewGoal()
    } else {
      localStorageManager.setItem(
        COMPLETED_GROUP_IMPACT_VIEWS,
        completedViews + 1
      )
    }
  } else {
    const currentViews = localStorageManager.getNumericItem(
      CURRENT_GROUP_IMPACT_VIEWS,
      0
    )
    if (currentViews < NEW_VIEWS_BEFORE_NORMAL) {
      sidebarMode = impactStateAndBadgeText.NEW
      localStorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, currentViews + 1)
    }
  }

  return (
    <div>
      {displayCelebration && <Celebration />}
      <GroupImpactSidebar
        badgeText={sidebarMode}
        groupImpactMetric={groupImpactMetric}
        lastGroupImpactMetric={differentGoal && lastGroupImpactMetric}
        open={false}
        nextGoalButtonClickHandler={
          sidebarMode === impactStateAndBadgeText.COMPLETED
            ? beginNewGoal
            : () => {}
        }
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

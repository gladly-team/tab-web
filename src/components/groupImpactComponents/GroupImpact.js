import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import GroupImpactSidebar from 'src/components/groupImpactComponents/GroupImpactSidebar'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localStorageManager from 'src/utils/localstorage-mgr'
import {
  COMPLETED_GROUP_IMPACT_VIEWS,
  CURRENT_GROUP_IMPACT_VIEWS,
  GROUP_IMPACT_SIDEBAR_STATE,
} from 'src/utils/constants'
import { makeStyles } from '@material-ui/core/styles'
import Celebration from '../Confetti'

const COMPLETED_VIEWS_BEFORE_NEW = 3
const NEW_VIEWS_BEFORE_NORMAL = 3

const useStyles = makeStyles(() => ({
  wrapper: {
    height: '100%',
  },
}))

const GroupImpact = ({ groupImpactMetric }) => {
  const classes = useStyles()
  const lastGroupImpactMetric =
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric()
  const [displayCelebration, setDisplayCelebration] = useState(false)
  const [sidebarMode, setSidebarMode] = useState(
    GROUP_IMPACT_SIDEBAR_STATE.NORMAL
  )

  const beginNewGoal = useCallback(() => {
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      groupImpactMetric
    )
    localStorageManager.setItem(COMPLETED_GROUP_IMPACT_VIEWS, 0)
    localStorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 0)
    setSidebarMode(GROUP_IMPACT_SIDEBAR_STATE.NEW)
    setDisplayCelebration(false)
  }, [groupImpactMetric])

  useEffect(() => {
    const differentGoal =
      lastGroupImpactMetric && lastGroupImpactMetric.id !== groupImpactMetric.id
    if (differentGoal) {
      setSidebarMode(GROUP_IMPACT_SIDEBAR_STATE.COMPLETED)
      const completedViews = localStorageManager.getNumericItem(
        COMPLETED_GROUP_IMPACT_VIEWS,
        0
      )
      if (completedViews === 0) {
        setDisplayCelebration(true)
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
        setSidebarMode(GROUP_IMPACT_SIDEBAR_STATE.NEW)
        localStorageManager.setItem(
          CURRENT_GROUP_IMPACT_VIEWS,
          currentViews + 1
        )
      }
    }
  }, [beginNewGoal, groupImpactMetric, lastGroupImpactMetric])

  return (
    <div className={classes.wrapper}>
      {displayCelebration && <Celebration />}
      <GroupImpactSidebar
        groupImpactSidebarState={sidebarMode}
        groupImpactMetric={groupImpactMetric}
        lastGroupImpactMetric={lastGroupImpactMetric}
        open={false}
        nextGoalButtonClickHandler={
          sidebarMode === GROUP_IMPACT_SIDEBAR_STATE.COMPLETED
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

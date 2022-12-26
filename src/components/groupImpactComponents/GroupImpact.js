import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import GroupImpactSidebar from 'src/components/groupImpactComponents/GroupImpactSidebar'
import GroupGoalNotification from 'src/components/groupImpactComponents/GroupGoalNotification'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localStorageManager from 'src/utils/localstorage-mgr'
import {
  COMPLETED_GROUP_IMPACT_VIEWS,
  CURRENT_GROUP_IMPACT_VIEWS,
  GROUP_IMPACT_SIDEBAR_STATE,
} from 'src/utils/constants'
import { makeStyles } from '@material-ui/core/styles'
import Slide from '@material-ui/core/Slide'
import Fade from '@material-ui/core/Fade'
import Celebration from '../Confetti'

const COMPLETED_VIEWS_BEFORE_NEW = 3
const NEW_VIEWS_BEFORE_NORMAL = 3

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  groupGoalNotification: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
}))

const GroupImpact = ({ groupImpactMetric }) => {
  const classes = useStyles()
  const [lastGroupImpactMetric, setLastSeenGroupImpactMetric] = useState(
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric()
  )
  const [displayCelebration, setDisplayCelebration] = useState(false)
  const [sidebarMode, setSidebarMode] = useState(
    GROUP_IMPACT_SIDEBAR_STATE.NORMAL
  )
  const { impactMetric } = groupImpactMetric
  const { impactTitle } = impactMetric
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const openSidebar = () => {
    setSidebarOpen(true)
  }

  const beginNewGoal = useCallback(() => {
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      groupImpactMetric
    )
    setLastSeenGroupImpactMetric(groupImpactMetric)
    localStorageManager.setItem(COMPLETED_GROUP_IMPACT_VIEWS, 0)
    localStorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 0)
    setSidebarMode(GROUP_IMPACT_SIDEBAR_STATE.NEW)
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
      {displayCelebration && <Celebration fireOnce />}
      <GroupImpactSidebar
        groupImpactSidebarState={sidebarMode}
        groupImpactMetric={groupImpactMetric}
        lastGroupImpactMetric={lastGroupImpactMetric}
        open={sidebarOpen}
        nextGoalButtonClickHandler={
          sidebarMode === GROUP_IMPACT_SIDEBAR_STATE.COMPLETED
            ? beginNewGoal
            : () => {}
        }
        openHandler={toggleSidebar}
      />
      {sidebarMode !== GROUP_IMPACT_SIDEBAR_STATE.NORMAL && (
        <Slide direction="right" in={!sidebarOpen}>
          <Fade in={!sidebarOpen}>
            <div className={classes.groupGoalNotification}>
              <GroupGoalNotification
                mode={sidebarMode}
                open
                impactTitle={impactTitle}
                onDetails={openSidebar}
                onNextGoal={beginNewGoal}
                onGoalStarted={openSidebar}
              />
            </div>
          </Fade>
        </Slide>
      )}
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

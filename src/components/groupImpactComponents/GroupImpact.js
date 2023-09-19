import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import useOnClickOutside from 'src/utils/hooks/useOnClickOutside'
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

const GroupImpactWrapper = ({ user }) => {
  const { cause } = user
  const { groupImpactMetric } = cause

  // Do not display anything if there is no groupImpactMetric
  if (groupImpactMetric === null) {
    return null
  }

  return <GroupImpact user={user} />
}

const GroupImpact = ({ user }) => {
  const { cause, leaderboard, id: userId, groupImpactHistory } = user
  const { groupImpactMetric, groupImpactMetricCount } = cause
  const classes = useStyles()

  // Locking groupImpactMetric so it does not change on other action on the page.
  const [lastGroupImpactMetric, setLastSeenGroupImpactMetric] = useState(
    localstorageGroupImpactManager.getLastSeenGroupImpactMetric() || {
      id: null,
    }
  )
  const [displayCelebration, setDisplayCelebration] = useState(false)
  const [sidebarMode, setSidebarMode] = useState(
    GROUP_IMPACT_SIDEBAR_STATE.NORMAL
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    id,
    dollarGoal,
    dollarProgressFromSearch,
    impactMetric,
    dateStarted,
    dateExpires,
  } = groupImpactMetric
  const { impactTitle, impactCountPerMetric, whyValuableDescription } =
    impactMetric

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const openSidebar = () => {
    setSidebarOpen(true)
  }

  const onGoalStarted = () => {
    setSidebarOpen(true)
    setSidebarMode(GROUP_IMPACT_SIDEBAR_STATE.NORMAL)

    // Advance views to put sidebar in future to normal mode.
    localStorageManager.setItem(
      CURRENT_GROUP_IMPACT_VIEWS,
      NEW_VIEWS_BEFORE_NORMAL + 1
    )
  }

  const beginNewGoal = useCallback(() => {
    const newGroupImpactMetric = {
      id,
      dollarProgress: dollarGoal,
      dollarProgressFromSearch,
      dollarGoal,
      impactMetric: {
        impactTitle,
        whyValuableDescription,
      },
    }
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      newGroupImpactMetric
    )
    setLastSeenGroupImpactMetric(newGroupImpactMetric)
    localStorageManager.setItem(COMPLETED_GROUP_IMPACT_VIEWS, 0)
    localStorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 0)
    setSidebarMode(GROUP_IMPACT_SIDEBAR_STATE.NEW)
  }, [
    id,
    dollarGoal,
    dollarProgressFromSearch,
    impactTitle,
    whyValuableDescription,
  ])

  useEffect(() => {
    if (lastGroupImpactMetric.id === null) {
      localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
        groupImpactMetric
      )
      setLastSeenGroupImpactMetric(groupImpactMetric)
    }
  }, [groupImpactMetric, lastGroupImpactMetric.id])

  useEffect(() => {
    const differentGoal = lastGroupImpactMetric.id !== id
    if (differentGoal && lastGroupImpactMetric.id) {
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
  }, [beginNewGoal, id, lastGroupImpactMetric.id])

  const ref = useRef()
  useOnClickOutside(ref, () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  })

  return (
    <div className={classes.wrapper} ref={ref}>
      {displayCelebration && <Celebration fireOnce />}
      <GroupImpactSidebar
        groupImpactSidebarState={sidebarMode}
        groupImpactMetric={groupImpactMetric}
        lastGroupImpactMetric={
          lastGroupImpactMetric.id && lastGroupImpactMetric
        }
        open={sidebarOpen}
        nextGoalButtonClickHandler={
          sidebarMode === GROUP_IMPACT_SIDEBAR_STATE.COMPLETED
            ? beginNewGoal
            : () => {}
        }
        openHandler={toggleSidebar}
        groupImpactMetricCount={groupImpactMetricCount}
        leaderboard={leaderboard}
        userId={userId}
        groupImpactHistory={groupImpactHistory}
        dateExpires={dateExpires}
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
                onGoalStarted={onGoalStarted}
                impactCountPerMetric={impactCountPerMetric}
                dateStarted={dateExpires ? dateStarted : null}
              />
            </div>
          </Fade>
        </Slide>
      )}
    </div>
  )
}

GroupImpact.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cause: PropTypes.shape({
      groupImpactMetric: PropTypes.shape({
        id: PropTypes.string.isRequired,
        dollarProgress: PropTypes.number.isRequired,
        dollarProgressFromSearch: PropTypes.number.isRequired,
        dollarGoal: PropTypes.number.isRequired,
        impactMetric: PropTypes.shape({
          impactTitle: PropTypes.string.isRequired,
          whyValuableDescription: PropTypes.string.isRequired,
          impactCountPerMetric: PropTypes.number.isRequired,
        }),
        dateStarted: PropTypes.string,
        dateExpires: PropTypes.string,
      }).isRequired,
      groupImpactMetricCount: PropTypes.number,
    }).isRequired,
    leaderboard: PropTypes.shape({
      position: PropTypes.number,
      user: PropTypes.shape({
        username: PropTypes.string,
        id: PropTypes.string,
      }),
      userGroupImpactMetric: PropTypes.shape({
        dollarContribution: PropTypes.number.isRequired,
        tabDollarContribution: PropTypes.number,
        searchDollarContribution: PropTypes.number,
        shopDollarContribution: PropTypes.number,
        referralDollarContribution: PropTypes.number,
      }),
    }),
    groupImpactHistory: PropTypes.arrayOf(
      PropTypes.shape({
        dollarContribution: PropTypes.number.isRequired,
        tabDollarContribution: PropTypes.number,
        searchDollarContribution: PropTypes.number,
        shopDollarContribution: PropTypes.number,
        referralDollarContribution: PropTypes.number,
        dateStarted: PropTypes.string,
      })
    ),
  }).isRequired,
}

GroupImpact.defaultProps = {}

GroupImpactWrapper.propTypes = {
  user: PropTypes.shape({
    cause: PropTypes.shape({
      groupImpactMetric: PropTypes.shape({
        id: PropTypes.string.isRequired,
        dollarProgress: PropTypes.number.isRequired,
        dollarProgressFromSearch: PropTypes.number.isRequired,
        dollarGoal: PropTypes.number.isRequired,
        impactMetric: PropTypes.shape({
          impactTitle: PropTypes.string.isRequired,
          whyValuableDescription: PropTypes.string.isRequired,
          impactCountPerMetric: PropTypes.number,
        }),
        dateStarted: PropTypes.string,
        dateExpires: PropTypes.string,
      }),
      groupImpactMetricCount: PropTypes.number,
    }).isRequired,
    leaderboard: PropTypes.shape({
      position: PropTypes.number,
      user: PropTypes.shape({
        username: PropTypes.string,
        id: PropTypes.string,
      }),
      userGroupImpactMetric: PropTypes.shape({
        dollarContribution: PropTypes.number.isRequired,
        tabDollarContribution: PropTypes.number,
        searchDollarContribution: PropTypes.number,
        shopDollarContribution: PropTypes.number,
        referralDollarContribution: PropTypes.number,
      }),
    }),
    groupImpactHistory: PropTypes.arrayOf(
      PropTypes.shape({
        dollarContribution: PropTypes.number.isRequired,
        tabDollarContribution: PropTypes.number,
        searchDollarContribution: PropTypes.number,
        shopDollarContribution: PropTypes.number,
        referralDollarContribution: PropTypes.number,
        dateStarted: PropTypes.string,
      })
    ),
  }).isRequired,
}

GroupImpactWrapper.defaultProps = {}

export default GroupImpactWrapper

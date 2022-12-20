import localStorageManager from './localstorage-mgr'
import { LAST_SEEN_GROUP_IMPACT_METRIC } from './constants'

const setLastSeenGroupImpactMetric = (groupImpactMetric) => {
  localStorageManager.setItem(
    LAST_SEEN_GROUP_IMPACT_METRIC,
    JSON.stringify(groupImpactMetric)
  )
}

const getLastSeenGroupImpactMetric = () => {
  const groupImpactMetricString = localStorageManager.getItem(
    LAST_SEEN_GROUP_IMPACT_METRIC
  )
  try {
    return JSON.parse(groupImpactMetricString)
  } catch (e) {
    return null
  }
}

export default {
  setLastSeenGroupImpactMetric,
  getLastSeenGroupImpactMetric,
}

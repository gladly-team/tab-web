import localStorageManager from './localstorage-mgr'
import { STORAGE_FEATURES } from './constants'
import { getFeatureValue as getFeatureValueFromList } from './growthbookUtils'

const setFeatures = (features) => {
  localStorageManager.setItem(STORAGE_FEATURES, JSON.stringify(features))
}

const getFeatures = () => {
  const featuresString = localStorageManager.getItem(STORAGE_FEATURES)
  try {
    const parsedString = JSON.parse(featuresString)
    return parsedString === null ? [] : parsedString
  } catch (e) {
    return []
  }
}

const getFeatureValue = (experimentName) => {
  const features = getFeatures()
  return getFeatureValueFromList(features, experimentName)
}

export default {
  setFeatures,
  getFeatures,
  getFeatureValue,
}

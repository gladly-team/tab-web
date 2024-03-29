/* eslint-disable import/prefer-default-export */

export const getFeatureValue = (features, experimentName) => {
  const desiredFeature = features.find(
    (feature) => feature.featureName === experimentName
  )
  return desiredFeature && desiredFeature.variation
}

import { getAvailableAdUnits } from 'tab-ads'

// TODO: implement
/**
 * Determine if the user has viewed the maximum number of ads
 * today, using tab count as a proxy.
 * @return {Boolean} Whether the user has viewed the max ads today.
 */
const hasUserReachedMaxTabsToday = () => {
  // If the user has exceeded the daily tab maximum,
  // do not show ads.
  // https://github.com/gladly-team/tab/issues/202
  return false
}

// TODO: implement
/**
 * Determine if we should show only one ad. We'll show one ad to
 * users for the first X hours after they join.
 * @return {Boolean} Whether to show one ad.
 */
const shouldShowOneAd = () => {
  return false
}

/**
 * Return an object of ad units we should display. This returns ad units
 * even if ads are disabled.
 * @return {Object} AdUnitsInfo
 * @return {Object|null} AdUnitsInfo.leaderboard - a tab-ads ad unit
 *   definition for the 728x90 ad, or null if we shouldn't show that
 *   ad unit
 * @return {Object|null} AdUnitsInfo.rectangleAdPrimary - a tab-ads
 *   ad unit definition for the first 300x250 ad, or null if we
 *   shouldn't show that ad unit
 * @return {Object|null} AdUnitsInfo.rectangleAdSecondary - a tab-ads
 *   ad unit definition for the second 300x250 ad, or null if we
 *   shouldn't show that ad unit
 */
export const getAdUnits = () => {
  let numberOfAdsToShow
  if (hasUserReachedMaxTabsToday()) {
    numberOfAdsToShow = 0
  } else if (shouldShowOneAd()) {
    numberOfAdsToShow = 1
  } else {
    numberOfAdsToShow = 3
  }
  const {
    leaderboard,
    rectangleAdPrimary,
    rectangleAdSecondary,
  } = getAvailableAdUnits()
  return {
    ...(numberOfAdsToShow > 0 && { leaderboard }),
    ...(numberOfAdsToShow > 1 && { rectangleAdPrimary }),
    ...(numberOfAdsToShow > 2 && { rectangleAdSecondary }),
  }
}
/**
 * Determine if we should fetch and display ads. Ads are disabled
 * by env variable or if the user views a lot of ads in a single day.
 * @return {Boolean} Whether ads are enabled.
 */
export const areAdsEnabled = () =>
  process.env.ADS_ENABLED === 'true' && !hasUserReachedMaxTabsToday()

/**
 * Return true if we want to show mock ads (for development only).
 * @return {Boolean} Whether to show mock ads.
 */
export const showMockAds = () => process.env.ADS_USE_MOCK_ADS === 'true'

// TODO: implement
export const isInEuropeanUnion = async () => false

import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import moment from 'moment'
import localStorageMgr from './localstorage-mgr'

import {
  STORAGE_TABS_RECENT_DAY_COUNT,
  STORAGE_TABS_LAST_TAB_OPENED_DATE,
  MAX_TABS_WITH_ADS,
} from './constants'

try {
  ensureValuesAreDefined([
    process.env.NEXT_PUBLIC_ADS_ENABLED,
    process.env.NEXT_PUBLIC_ADS_USE_MOCK_ADS,
  ])
} catch (e) {
  throw new Error(
    'Environment variables NEXT_PUBLIC_ADS_ENABLED and NEXT_PUBLIC_ADS_USE_MOCK_ADS must be set.'
  )
}

/**
 * Get the count of tabs opened today (UTC day) from localStorage. If no
 * value exists in storage, return zero.
 * @returns {number} The user's tab count
 */
const getTabsOpenedTodayFromStorage = () => {
  const tabCountStr = localStorageMgr.getItem(STORAGE_TABS_RECENT_DAY_COUNT)
  const tabCountParsed = parseInt(tabCountStr, 10)
  const tabCount = Number.isNaN(tabCountParsed) ? 0 : tabCountParsed
  return tabCount
}

/**
 * Get whether the user has opened a tab today, according to the tab
 * count in localStorage.
 * @returns {boolean} Whether the user has opened a tab today
 */
const hasUserOpenedTabToday = () => {
  // An ISO timestamp
  const tabCountDate = localStorageMgr.getItem(
    STORAGE_TABS_LAST_TAB_OPENED_DATE
  )

  // If no current date, assume no tabs have been opened today.
  if (!tabCountDate) {
    return 0
  }

  // If the current date is the same as the most recent date a
  // tab was opened, it is not the first tab today.
  const hasOpenedTabToday =
    moment(tabCountDate).utc().format('LL') === moment().utc().format('LL')
  return hasOpenedTabToday
}

/**
 * Get the count of tabs opened today (UTC day) from localStorage. If no
 * value exists in storage, return zero.
 * @returns {number} The user's tab count
 */
export const getTabsOpenedToday = () => {
  if (!hasUserOpenedTabToday()) {
    return 0
  }
  return getTabsOpenedTodayFromStorage()
}

/**
 * Determine if the user has viewed the maximum number of ads
 * today, using tab count as a proxy.
 * @return {Boolean} Whether the user has viewed the max ads today.
 */
// If the user has exceeded the daily tab maximum,
// do not show ads.
// https://github.com/gladly-team/tab/issues/202
const hasUserReachedMaxTabsToday = () => {
  // If the user has exceeded the daily tab maximum,
  // do not show ads.
  // https://github.com/gladly-team/tab/issues/202
  const tabsOpenedToday = getTabsOpenedToday()
  return tabsOpenedToday > MAX_TABS_WITH_ADS
}

/**
 * Sets the localStorage value for the date of the last tab opened
 * to an ISO timestamp of the current time.
 * @returns {undefined}
 */
const setLastTabOpenedDateInLocalStorage = () => {
  localStorageMgr.setItem(
    STORAGE_TABS_LAST_TAB_OPENED_DATE,
    moment.utc().toISOString()
  )
}

/**
 * Sets the localStorage value for today's tab count to the value
 * of `tabCount`.
 * @param {number} tabCount - The number of tabs today
 * @returns {undefined}
 */
const setTabCountInLocalStorage = (tabCount) => {
  localStorageMgr.setItem(STORAGE_TABS_RECENT_DAY_COUNT, tabCount)
}

/**
 * Increment the count of tabs opened today (UTC day) in localStorage.
 * If the most recent day of a tab opening is prior to today, reset
 * the tab counter. If no values exist in localStorage, set them.
 * @returns {undefined}
 */
export const incrementTabsOpenedToday = () => {
  if (hasUserOpenedTabToday()) {
    // Increment the tab count
    const currentTabCount = getTabsOpenedTodayFromStorage()
    setTabCountInLocalStorage(currentTabCount + 1)
  } else {
    // Reset the date and tab count
    setLastTabOpenedDateInLocalStorage()
    setTabCountInLocalStorage(1)
  }
}

/**
 * Determine if we should fetch and display ads. Ads are disabled
 * by env variable or if the user views a lot of ads in a single day.
 * @return {Boolean} Whether ads are enabled.
 */
export const areAdsEnabled = () =>
  process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' &&
  !hasUserReachedMaxTabsToday()

/**
 * Return true if we want to show mock ads (for development only).
 * @return {Boolean} Whether to show mock ads.
 */
export const showMockAds = () =>
  process.env.NEXT_PUBLIC_ADS_USE_MOCK_ADS === 'true'

/**
 * Return true if we want to pass a development-only key-value to our
 * ad server.
 * @return {Boolean}
 */
export const isGAMDevEnvironment = () =>
  process.env.NEXT_PUBLIC_GAM_DEV_ENVIRONMENT === 'true'

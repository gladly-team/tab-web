import moment from 'moment'
import MockDate from 'mockdate'
import localStorageMgr from '../localstorage-mgr'
import {
  MAX_TABS_WITH_ADS,
  STORAGE_TABS_LAST_TAB_OPENED_DATE,
  STORAGE_TABS_RECENT_DAY_COUNT,
} from '../constants'
import localStorageFeaturesManager from '../localStorageFeaturesManager'

// jest.mock('js/utils/feature-flags')
// jest.mock('js/utils/experiments')
jest.mock('tab-ads')
jest.mock('../localstorage-mgr', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))
jest.mock('../localStorageFeaturesManager')
const mockNow = '2017-05-19T13:59:58.000Z'
beforeEach(() => {
  process.env.NEXT_PUBLIC_ADS_ENABLED = true
  process.env.NEXT_PUBLIC_ADS_USE_MOCK_ADS = false
  MockDate.set(moment(mockNow))
  jest.clearAllMocks()
})

afterEach(() => {
  MockDate.set(moment(mockNow))
})

describe('isGAMDevEnvironment', () => {
  it('returns false when env var NEXT_PUBLIC_GAM_DEV_ENVIRONMENT is undefined', async () => {
    expect.assertions(1)
    delete process.env.NEXT_PUBLIC_GAM_DEV_ENVIRONMENT
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    expect(isGAMDevEnvironment()).toBe(false)
  })

  it('returns false when env var NEXT_PUBLIC_GAM_DEV_ENVIRONMENT=false', async () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_GAM_DEV_ENVIRONMENT = false
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    expect(isGAMDevEnvironment()).toBe(false)
  })

  it('returns true when env var NEXT_PUBLIC_GAM_DEV_ENVIRONMENT=true', async () => {
    expect.assertions(1)
    process.env.NEXT_PUBLIC_GAM_DEV_ENVIRONMENT = true
    const { isGAMDevEnvironment } = require('src/utils/adHelpers')
    expect(isGAMDevEnvironment()).toBe(true)
  })
})

describe('Tab Tracking Methods', () => {
  // getTabsOpenedToday method
  it('returns tabs today when the user has opened tabs today', () => {
    localStorageMgr.getItem.mockReturnValueOnce(
      moment(mockNow).utc().toISOString()
    )
    localStorageMgr.getItem.mockReturnValueOnce(14)
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(14)
  })

  it('returns zero tabs today when the user last opened tabs more than one day ago', () => {
    localStorageMgr.setItem(
      STORAGE_TABS_LAST_TAB_OPENED_DATE,
      moment('2017-05-17T13:59:58.000Z').utc().toISOString()
    )
    localStorageMgr.setItem(STORAGE_TABS_RECENT_DAY_COUNT, 14)
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day values are not set in localStorage', () => {
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab date value is not set in localStorage', () => {
    localStorageMgr.setItem(STORAGE_TABS_RECENT_DAY_COUNT, 6)
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day count is not set in localStorage', () => {
    localStorageMgr.getItem.mockReturnValueOnce(undefined)
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  // incrementTabsOpenedToday method
  it('increments the tabs today when the user has opened tabs today', () => {
    localStorageMgr.getItem.mockReturnValueOnce(
      moment(mockNow).utc().toISOString()
    )
    localStorageMgr.getItem.mockReturnValueOnce(14)
    jest.spyOn(localStorageMgr, 'setItem')
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_RECENT_DAY_COUNT,
      15
    )
    expect(localStorageMgr.setItem).not.toHaveBeenCalledWith(
      STORAGE_TABS_LAST_TAB_OPENED_DATE,
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the user last opened tabs more than one day ago', () => {
    localStorageMgr.setItem(
      STORAGE_TABS_LAST_TAB_OPENED_DATE,
      moment('2018-04-11T08:05:10.000').utc().toISOString()
    )
    localStorageMgr.setItem(STORAGE_TABS_RECENT_DAY_COUNT, 14)
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_RECENT_DAY_COUNT,
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_LAST_TAB_OPENED_DATE,
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab day values are not set in localStorage', () => {
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_RECENT_DAY_COUNT,
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_LAST_TAB_OPENED_DATE,
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab date value is not set in localStorage', () => {
    localStorageMgr.setItem(STORAGE_TABS_RECENT_DAY_COUNT, 6)
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_RECENT_DAY_COUNT,
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_LAST_TAB_OPENED_DATE,
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab day count is not set in localStorage', () => {
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      STORAGE_TABS_RECENT_DAY_COUNT,
      1
    )
  })
})

describe('adHelpers: getAdUnits', () => {
  it('returns zero ads if test returns false', () => {
    localStorageFeaturesManager.getFeatureValue.mockReturnValue('false')
    localStorageMgr.getItem.mockReturnValueOnce(
      moment(mockNow).utc().toISOString()
    )
    localStorageMgr.getItem.mockReturnValueOnce(MAX_TABS_WITH_ADS + 1)
    const { getAdUnits } = require('../adHelpers')
    expect(getAdUnits()).toEqual({})
  })
  it('returns two ads if test returns false', () => {
    localStorageFeaturesManager.getFeatureValue.mockReturnValue('false')
    const { getAdUnits } = require('../adHelpers')
    expect(getAdUnits()).toEqual({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
    })
  })
  it('returns three ads if test returns true', () => {
    localStorageFeaturesManager.getFeatureValue.mockReturnValue('true')
    const { getAdUnits } = require('../adHelpers')
    expect(getAdUnits()).toEqual({
      leaderboard: {
        // The long leaderboard ad.
        adId: 'div-gpt-ad-1464385677836-0',
        adUnitId: '/43865596/HBTL',
        sizes: [[728, 90]],
      },
      rectangleAdPrimary: {
        // The primary rectangle ad (bottom-right).
        adId: 'div-gpt-ad-1464385742501-0',
        adUnitId: '/43865596/HBTR',
        sizes: [[300, 250]],
      },
      rectangleAdSecondary: {
        // The second rectangle ad (right side, above the first).
        adId: 'div-gpt-ad-1539903223131-0',
        adUnitId: '/43865596/HBTR2',
        sizes: [[300, 250]],
      },
    })
  })
})

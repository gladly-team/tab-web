import moment from 'moment'
import MockDate from 'mockdate'
import localStorageMgr from '../localstorage-mgr'
import {
  STORAGE_TABS_LAST_TAB_OPENED_DATE,
  STORAGE_TABS_RECENT_DAY_COUNT,
} from '../constants'

// jest.mock('js/utils/feature-flags')
// jest.mock('js/utils/experiments')
jest.mock('tab-ads')
jest.mock('../localstorage-mgr', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))
beforeEach(() => {
  process.env.NEXT_PUBLIC_ADS_ENABLED = true
  process.env.NEXT_PUBLIC_ADS_USE_MOCK_ADS = false
  MockDate.set(moment(mockNow))
  jest.clearAllMocks()
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
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

const mockNow = '2017-05-19T13:59:58.000Z'
const adsEnabledEnv = process.env.REACT_APP_ADS_ENABLED

beforeEach(() => {
  // Set a default "tabs opened today" value for tests.
})

afterEach(() => {
  MockDate.reset()
  process.env.REACT_APP_ADS_ENABLED = adsEnabledEnv // Reset after tests
  process.env.REACT_APP_USE_MOCK_ADS = 'false' // Reset after tests
})
describe('Tab Tracking Methods', () => {
  // getTabsOpenedToday method
  it('returns tabs today when the user has opened tabs today', () => {
    localStorageMgr.getItem.mockReturnValueOnce(
      moment('2017-05-19T13:59:58.000Z').utc().toISOString()
    )
    localStorageMgr.getItem.mockReturnValueOnce(14)
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(14)
  })

  it('returns zero tabs today when the user last opened tabs more than one day ago', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2017-05-17T13:59:58.000Z').utc().toISOString()
    )
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day values are not set in localStorage', () => {
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab date value is not set in localStorage', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.count', 6)
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  it('returns zero tabs today when the last tab day count is not set in localStorage', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2017-05-19T13:59:58.000Z').utc().toISOString()
    )
    localStorageMgr.removeItem()
    const { getTabsOpenedToday } = require('../adHelpers')
    expect(getTabsOpenedToday()).toBe(0)
  })

  // incrementTabsOpenedToday method
  it('increments the tabs today when the user has opened tabs today', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2017-05-19T13:59:58.000Z').utc().toISOString()
    )
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    jest.spyOn(localStorageMgr, 'setItem')
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      15
    )
    expect(localStorageMgr.setItem).not.toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the user last opened tabs more than one day ago', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2018-04-11T08:05:10.000').utc().toISOString()
    )
    localStorageMgr.setItem('tab.user.lastTabDay.count', 14)
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab day values are not set in localStorage', () => {
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab date value is not set in localStorage', () => {
    localStorageMgr.setItem('tab.user.lastTabDay.count', 6)
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })

  it('resets the counter of tabs today when the last tab day count is not set in localStorage', () => {
    localStorageMgr.setItem(
      'tab.user.lastTabDay.date',
      moment('2017-05-19T13:59:58.000Z').utc().toISOString()
    )
    jest.clearAllMocks()
    const { incrementTabsOpenedToday } = require('../adHelpers')
    incrementTabsOpenedToday()
    expect(localStorageMgr.setItem).toHaveBeenCalledWith(
      'tab.user.lastTabDay.count',
      1
    )
    expect(localStorageMgr.setItem).not.toHaveBeenCalledWith(
      'tab.user.lastTabDay.date',
      moment.utc().toISOString()
    )
  })
})

// describe('adHelpers: areAdsEnabled', () => {
//   it('disables ads when REACT_APP_ADS_ENABLED env var is not set', () => {
//     process.env.REACT_APP_ADS_ENABLED = undefined
//     const { areAdsEnabled } = require('../adHelpers')
//     expect(areAdsEnabled()).toBe(false)
//   })

//   it('disables ads when REACT_APP_ADS_ENABLED env var is not "true"', () => {
//     process.env.REACT_APP_ADS_ENABLED = 'false'
//     const { areAdsEnabled } = require('../adHelpers')
//     expect(areAdsEnabled()).toBe(false)
//   })

//   it('enables ads when REACT_APP_ADS_ENABLED env var is "true" and the user has not opened any tabs today', () => {
//     process.env.REACT_APP_ADS_ENABLED = 'true'
//     getTabsOpenedToday.mockReturnValue(0)
//     const { areAdsEnabled } = require('../adHelpers')
//     expect(areAdsEnabled()).toBe(true)
//   })

//   it('enables ads when REACT_APP_ADS_ENABLED env var is "true" and the user has opened below the max number of tabs today', () => {
//     process.env.REACT_APP_ADS_ENABLED = 'true'
//     getTabsOpenedToday.mockReturnValue(135)
//     const { areAdsEnabled } = require('../adHelpers')
//     expect(areAdsEnabled()).toBe(true)
//   })

//   it('disables ads when the user has opened more than the max number of tabs today', () => {
//     process.env.REACT_APP_ADS_ENABLED = 'true'
//     getTabsOpenedToday.mockReturnValue(151)
//     const { areAdsEnabled } = require('../adHelpers')
//     expect(areAdsEnabled()).toBe(false)
//   })
// })

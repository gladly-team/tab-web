/* eslint-env jest */

import {
  CHROME_BROWSER,

  // EDGE_BROWSER,
  FIREFOX_BROWSER,
  UNSUPPORTED_BROWSER,
} from '../constants'

jest.mock('detect-browser')

const createMockBrowserInfo = (browser = 'chrome') => ({
  name: browser,
  os: 'Mac OS',
  type: 'browser',
  version: '58.0.3029',
})
afterEach(() => {
  jest.clearAllMocks()
})

describe('detectBrowser', () => {
  it('returns "chrome" for desktop Chrome', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('chrome', false))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "chrome" for mobile Chrome', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('chrome', true))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "chrome" for desktop chromium', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('chromium', false))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "chrome" for "crios" (Chrome on iOS)', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('crios', true))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(CHROME_BROWSER)
  })

  it('returns "firefox" for desktop Firefox', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('firefox', false))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(FIREFOX_BROWSER)
  })

  it('returns "firefox" for mobile Firefox', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('firefox', true))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(FIREFOX_BROWSER)
  })

  it('returns "other" for desktop Edge', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('edge', false))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })

  it('returns "other" for mobile Edge', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('edge', true))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })

  it('returns "other" for desktop Safari', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('safari', false))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })

  it('returns "other" for mobile Safari', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('safari', true))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })

  it('returns "other" for some unexpected browser name', () => {
    const { detect } = require('detect-browser')
    detect.mockReturnValueOnce(createMockBrowserInfo('hypebrowzer2000', false))
    const detectSupportedBrowser = require('src/utils/detectBrowser').default
    expect(detectSupportedBrowser()).toEqual(UNSUPPORTED_BROWSER)
  })
})

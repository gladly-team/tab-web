import {
  CHROME_BROWSER,
  EDGE_BROWSER,
  FIREFOX_BROWSER,
  OPERA_BROWSER,
  SAFARI_BROWSER,
  UNSUPPORTED_BROWSER,
} from 'src/utils/constants'

// Options as of 2022-09-04:
// https://github.com/DamonOehlman/detect-browser/blob/master/src/index.ts
/*
  'aol'
  'android'
  'bb10'
  'beaker'
  'chrome'
  'chromium-webview'
  'crios'
  'curl'
  'edge'
  'edge-chromium'
  'edge-ios'
  'facebook'
  'firefox'
  'fxios'
  'ie'
  'instagram'
  'ios'
  'ios-webview'
  'kakaotalk'
  'miui'
  'netfront'
  'opera'
  'opera-mini'
  'phantomjs'
  'pie'
  'safari'
  'samsung'
  'searchbot'
  'silk'
  'yandexbrowser'

*/
export const simplifyBrowserName = (browserName) => {
  switch (browserName) {
    case 'chrome':
    case 'chromium-webview':
    case 'crios':
      return CHROME_BROWSER
    case 'edge':
    case 'edge-ios':
    case 'edge-chromium':
    case 'ie':
      return EDGE_BROWSER
    case 'firefox':
    case 'fxios':
      return FIREFOX_BROWSER
    case 'opera':
    case 'opera-mini':
      return OPERA_BROWSER
    case 'ios':
    case 'ios-webview':
    case 'safari':
      return SAFARI_BROWSER
    default:
      return UNSUPPORTED_BROWSER
  }
}

// TODO
export const isSearchExtensionSupported = (browserNameSimplified) => {
  const sfacSupportedBrowsers = [CHROME_BROWSER, FIREFOX_BROWSER]
  return sfacSupportedBrowsers.indexOf(browserNameSimplified) > -1
}

// TODO
export const isTabExtensionSupported = (browserNameSimplified) => {
  const tfacSupportedBrowsers = [CHROME_BROWSER, EDGE_BROWSER, SAFARI_BROWSER]
  return tfacSupportedBrowsers.indexOf(browserNameSimplified) > -1
}

import detectBrowser from 'browser-detect'
import {
  CHROME_BROWSER,

  // EDGE_BROWSER,
  FIREFOX_BROWSER,
  UNSUPPORTED_BROWSER,
} from './constants'

// Note: we're currently only using this to know support for the SFAC
// extension. Refactor if other browser detection logic is needed.

/**
 * Determines the user's browser. If the browser is one
 * for which we have a browser extension, return the browser
 * name; else, return "other".
 * @return {String} One of "chrome", "firefox", "edge", or "other"
 */
const detectSupportedBrowser = () => {
  const browserInfo = detectBrowser()
  let browser
  switch (browserInfo.name) {
    case 'chrome':
      browser = CHROME_BROWSER
      break
    case 'chromium':
      browser = CHROME_BROWSER
      break
    case 'crios':
      browser = CHROME_BROWSER
      break

    // case 'edge':
    //   browser = EDGE_BROWSER
    //   break
    case 'firefox':
      browser = FIREFOX_BROWSER
      break
    default:
      browser = UNSUPPORTED_BROWSER
      break
  }
  return browser
}

export default detectSupportedBrowser

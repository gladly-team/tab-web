import useBrowserInfo from 'src/utils/hooks/useBrowserInfo'
import { simplifyBrowserName } from 'src/utils/browserSupport'

/**
 * Return the user's browser name, simplified to a short list of browsers
 * we care about.
 * @param {String|undefined} userAgent - An optional user agent string. Used
 *   to determine the browser when on the server side.
 * @return {String} The browser name
 */
const useBrowserName = ({ userAgent } = {}) => {
  const browserInfo = useBrowserInfo({ userAgent }) || {}
  const browserName = simplifyBrowserName(browserInfo.name)
  return browserName
}

export default useBrowserName

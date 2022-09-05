import { useEffect, useState } from 'react'
import { detect } from 'detect-browser'
import { isServerSide } from 'src/utils/ssr'

/**
 * Return info about the user's browser and operating system.
 * @param {String|undefined} userAgent - An optional user agent string. Used
 *   only on the server side.
 * @return {Object} browserInfo - The return from the "detect-browser"
 *   library: https://github.com/DamonOehlman/detect-browser
 * @return {String} browserInfo.name - The browser name
 * @return {String} browserInfo.os - The operating system name
 * @return {String} browserInfo.type - The type of viewer
 * @return {String} browserInfo.version - The browser version
 */
const useBrowserInfo = ({ userAgent } = {}) => {
  // If provided a user agent string server-side, use it.
  let startingBrowserInfo
  if (isServerSide() && userAgent) {
    startingBrowserInfo = detect(userAgent)
  }

  const [browserInfo, setBrowserInfo] = useState(startingBrowserInfo)

  // Always redetect the browser on client-side mount.
  useEffect(() => {
    setBrowserInfo(detect())
  }, [])
  return browserInfo
}

export default useBrowserInfo

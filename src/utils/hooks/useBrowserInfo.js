import { useEffect, useState } from 'react'
import { detect } from 'detect-browser'
import { isServerSide } from 'src/utils/ssr'

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

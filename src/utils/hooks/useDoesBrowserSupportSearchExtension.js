import { useEffect, useState } from 'react'
import { detect } from 'detect-browser'
import {
  isSearchExtensionSupported,
  simplifyBrowserName,
} from 'src/utils/browserSupport'

const useDoesBrowserSupportSearchExtension = () => {
  const [isSearchSupported, setIsSearchSupported] = useState()
  useEffect(() => {
    const browserInfo = detect()
    const searchSupported = isSearchExtensionSupported(
      simplifyBrowserName(browserInfo.name)
    )
    setIsSearchSupported(searchSupported)
  }, [])
  return isSearchSupported
}

export default useDoesBrowserSupportSearchExtension

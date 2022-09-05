import useBrowserInfo from 'src/utils/hooks/useBrowserInfo'
import {
  isSearchExtensionSupported,
  simplifyBrowserName,
} from 'src/utils/browserSupport'

const useDoesBrowserSupportSearchExtension = ({ userAgent } = {}) => {
  const browserInfo = useBrowserInfo({ userAgent }) || {}
  const isSearchSupported = isSearchExtensionSupported(
    simplifyBrowserName(browserInfo.name)
  )
  return isSearchSupported
}

export default useDoesBrowserSupportSearchExtension

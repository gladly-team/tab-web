import useBrowserInfo from 'src/utils/hooks/useBrowserInfo'
import {
  isSearchExtensionSupported,
  simplifyBrowserName,
} from 'src/utils/browserSupport'

const useBrowserName = ({ userAgent } = {}) => {
  const browserInfo = useBrowserInfo({ userAgent }) || {}
  const browserName = simplifyBrowserName(browserInfo.name)
  return browserName
}

export default useBrowserName

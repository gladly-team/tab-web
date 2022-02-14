import logger from 'src/utils/logger'
import { isClientSide } from 'src/utils/ssr'

// eslint-disable-next-line consistent-return
const googleAnalytics = (...args) => {
  if (!isClientSide()) {
    logger.error('Google Analytics is not available server-side.')
    return
  }
  // eslint-disable-next-line no-undef
  const { gtag } = window
  try {
    gtag.apply(this, args)
  } catch (e) {
    logger.error(e)
  }
}

export default googleAnalytics

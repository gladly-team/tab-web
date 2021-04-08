import logger from 'src/utils/logger'
import { isClientSide } from 'src/utils/ssr'

// eslint-disable-next-line consistent-return
const facebookAnalytics = (...args) => {
  if (!isClientSide()) {
    logger.error('Facebook analytics are not available on `window.fbq`.')
    return
  }
  // eslint-disable-next-line no-undef
  const { fbq } = window
  try {
    fbq.apply(this, args)
  } catch (e) {
    logger.error(e)
  }
}

export default facebookAnalytics

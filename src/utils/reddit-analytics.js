import { isClientSide } from 'src/utils/ssr'
import logger from './logger'

// https://www.reddithelp.com/en/categories/advertising/creating-ads/installing-reddit-conversion-pixel
// eslint-disable-next-line consistent-return
const redditAnalytics = (...args) => {
  if (!isClientSide()) {
    logger.error('Reddit analytics are not available on `window.rdt`.')
    return
  }
  // eslint-disable-next-line no-undef
  const { rdt } = window
  try {
    rdt.apply(this, args)
  } catch (e) {
    logger.error(e)
  }
}

export default redditAnalytics

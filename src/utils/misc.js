/* eslint import/prefer-default-export: 0 */
import logger from './logger'

/**
 * Get an estimate of how much money is raised by a single valid tab.
 * @return {Number}
 */
export const getEstimatedMoneyRaisedPerTab = () => {
  let moneyRaised = parseFloat(process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB)
  if (Number.isNaN(moneyRaised)) {
    moneyRaised = 0.0
    logger.error(
      `Could not parse float from money raised env var value ${process.env.NEXT_PUBLIC_EST_MONEY_RAISED_PER_TAB}`
    )
  }
  return moneyRaised
}

/* eslint import/prefer-default-export: 0 */
import { isNil } from 'lodash/lang'

/**
 * Takes a number or numerical string and returns a string with commas
 * between each pair of three non-fractional digits.
 * @param {Number|String} amount - A number or numerical string
 * @return {String} The amount with commas where appropriate
 */
export const commaFormatted = amount => {
  if (isNil(amount)) {
    return '0'
  }
  const num = parseFloat(amount)
  return num.toLocaleString()
}

/**
 * Takes a number and returns a string
 * @param {Number|String} num - A number, such as 1234.567
 * @return {String} The number formatted as a en-US USD currency
 *   value, such as $1,234.57.
 */
export const currencyFormatUSD = num => {
  if (Number.isNaN(parseFloat(num))) {
    throw new Error(
      `Could not parse this value for currency formatting: ${num}`
    )
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

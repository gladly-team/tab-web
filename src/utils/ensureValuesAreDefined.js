import { isNil } from 'lodash/lang'

/**
 * Ensures that the value or array of values are all
 * non-nil. If any are nil, throws an error.
 * @param {Any|Array<Any>} value - A value or array of values
 *   of any type.
 * @return {undefined}
 */
const ensureValuesAreDefined = (value) => {
  let hasNilVal = false
  if (!Array.isArray(value)) {
    if (isNil(value)) {
      hasNilVal = true
    }
  } else {
    // If passed an empty, assume it should have contained a value.
    if (!value.length) {
      hasNilVal = true
    }
    // Test each entry in the array.
    value.forEach((item) => {
      if (isNil(item)) {
        hasNilVal = true
      }
    })
  }
  if (hasNilVal) {
    throw new Error('Received a nil value that we expected to be non-nil.')
  }
}

export default ensureValuesAreDefined

/* eslint-env jest */
/* eslint-disable no-console */

// Force warnings to fail Jest tests.
// https://github.com/facebook/jest/issues/6121#issuecomment-444269677
const { error } = console
console.error = message => {
  error.apply(console, arguments) // eslint-disable-line no-undef
  throw message instanceof Error ? message : new Error(message)
}

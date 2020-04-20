/* eslint-env jest */
/* eslint no-console: 0, import/no-extraneous-dependencies: 0 */

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

// Note that Jest automocking appears to be broken.
// https://github.com/facebook/jest/issues/6127
// We can consider enabling it later.

// Force warnings to fail Jest tests.
// https://github.com/facebook/jest/issues/6121#issuecomment-444269677
const { error } = console

// eslint-disable-next-line func-names
console.error = function(message, ...args) {
  error.apply(console, args) // keep default behaviour
  throw message instanceof Error ? message : new Error(message)
}

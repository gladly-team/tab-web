/* eslint-env jest */
/* eslint no-console: 0, import/no-extraneous-dependencies: 0 */

import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

// FIXME
// Force warnings to fail Jest tests.
// https://github.com/facebook/jest/issues/6121#issuecomment-444269677
// const { error } = console
// console.error = message => {
//   error.apply(console, arguments) // eslint-disable-line no-undef
//   throw message instanceof Error ? message : new Error(message)
// }

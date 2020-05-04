/* eslint-env jest */

const mock = jest.genMockFromModule('react-relay')
mock.createFragmentContainer = wrappedComponent => wrappedComponent
module.exports = mock

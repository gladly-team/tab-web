/* eslint-env jest */

const mock = jest.genMockFromModule('react-relay')
mock.createFragmentContainer = jest.fn(wrappedComponent => wrappedComponent)
module.exports = mock

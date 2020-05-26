/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'

const mock = jest.genMockFromModule('react-relay')
mock.createFragmentContainer = jest.fn((wrappedComponent) => wrappedComponent)
mock.ReactRelayContext = {
  Consumer: jest.fn(({ children, ...otherProps }) => (
    <div data-test-id="mock-react-relay-consumer" {...otherProps}>
      {children}
    </div>
  )),
  Provider: jest.fn(({ children, ...otherProps }) => (
    <div data-test-id="mock-react-relay-provider" {...otherProps}>
      {children}
    </div>
  )),
}
mock.fetchQuery = jest.fn(() => Promise.resolve({}))

module.exports = mock

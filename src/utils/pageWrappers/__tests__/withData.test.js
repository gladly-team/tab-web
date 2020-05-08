import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import getMockFetchResponse from 'src/utils/testHelpers/getMockFetchResponse'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from 'src/utils/createRelayEnvironment'
import { AuthUserInfoContext } from 'src/utils/auth/hooks'
import { isClientSide } from 'src/utils/ssr'
import { createAuthUserInfo } from 'src/utils/auth/user'

jest.mock('react-relay')
jest.mock('src/utils/createRelayEnvironment')
jest.mock('src/utils/auth/hooks')
jest.mock('src/utils/ssr')

// Return a mock AuthUserInfo value for a signed-in user.
const getMockSignedInAuthUserInfo = () => {
  return createAuthUserInfo({
    firebaseUser: {
      uid: 'my-fake-id',
      email: 'fakeEmail@example.com',
      emailVerified: true,
    },
    token: 'some-mock-token',
    isClientInitialized: true,
  })
}

// The function provided to the withData HOC>
const mockRelayQueryGetter = jest.fn(() => ({
  query: 'some-query',
  variables: {
    special: 'variable',
  },
}))

// A mock component that serves as the wrapped child of the
// withData HOC we're testing.
const MockComponent = () => <div>hi</div>
MockComponent.getInitialProps = jest.fn()
MockComponent.displayName = 'MockComponent'

// Return a React component that provides the AuthUserInfoContext
// to children. Use this to wrap mounted components during testing.
const getMockAuthProviderComponent = ({
  initialValue = getMockSignedInAuthUserInfo(),
} = {}) => {
  const MockAuthProvider = ({ children, value }) => (
    <AuthUserInfoContext.Provider value={value || initialValue}>
      {children}
    </AuthUserInfoContext.Provider>
  )
  MockAuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.object,
  }
  MockAuthProvider.defaultProps = {
    value: null,
  }
  return MockAuthProvider
}

// Return mock props for the withData HOC.
const getMockPropsForHOC = () => ({
  queryRecords: { some: 'records' },
  queryProps: { some: 'props' },
  refetchDataOnMount: false,
})

beforeEach(() => {
  isClientSide.mockReturnValue(false)
  fetchQuery.mockResolvedValue(getMockFetchResponse())
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('withData: render', () => {
  it('contains the wrapped component', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = getMockPropsForHOC()
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: getMockSignedInAuthUserInfo(),
    })
    const wrapper = mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('calls initEnvironment with the query records and token on mount', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      queryRecords: { some: 'records', abc: 123 },
    }
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: getMockSignedInAuthUserInfo(),
    })
    mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(initEnvironment).toHaveBeenCalledWith({
      records: mockProps.queryRecords,
      token: 'some-mock-token',
    })
  })

  it('still calls initEnvironment when the user is not authenticated', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      queryRecords: { some: 'records', abc: 123 },
    }
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: createAuthUserInfo(), // user is not signed in
    })
    mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(initEnvironment).toHaveBeenCalledWith({
      records: mockProps.queryRecords,
      token: null, // not signed in
    })
  })

  it('calls initEnvironment only once on mount', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      queryRecords: { some: 'records', abc: 123 },
    }
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: getMockSignedInAuthUserInfo(),
    })
    mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(initEnvironment).toHaveBeenCalledTimes(1)
  })

  it('calls initEnvironment a second time if the AuthUser value changes', () => {
    expect.assertions(2)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      queryRecords: { some: 'records', abc: 123 },
    }
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: getMockSignedInAuthUserInfo(),
    })
    const wrapper = mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })

    expect(initEnvironment).toHaveBeenCalledWith({
      records: mockProps.queryRecords,
      token: 'some-mock-token',
    })

    initEnvironment.mockClear() // clear the mock

    // Update the AuthUserInfo context value.
    const newAuthUserInfo = createAuthUserInfo() // not signed in
    const provider = wrapper.getWrappingComponent()
    provider.setProps({ value: newAuthUserInfo })

    expect(initEnvironment).toHaveBeenCalledWith({
      records: mockProps.queryRecords,
      token: null,
    })
  })

  it('passes the expected environment to the Relay context provider (correct user token)', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = getMockPropsForHOC()
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: {
        ...getMockSignedInAuthUserInfo(),
        token: 'this-is-the-token',
      },
    })
    const wrapper = mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    const RelayContextProvider = wrapper.find(ReactRelayContext.Provider)
    expect(RelayContextProvider.prop('value').environment).toMatchObject({
      isMockRelayEnvironment: true,
      mockUserToken: 'this-is-the-token',
    })
  })

  it('passes a new environment to the Relay context provider after the user token changes', () => {
    expect.assertions(2)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = getMockPropsForHOC()
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: {
        ...getMockSignedInAuthUserInfo(),
        token: 'this-is-the-token',
      },
    })
    const wrapper = mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(
      wrapper.find(ReactRelayContext.Provider).prop('value').environment
    ).toMatchObject({
      isMockRelayEnvironment: true,
      mockUserToken: 'this-is-the-token',
    })

    // Update the AuthUserInfo context value.
    const newAuthUserInfo = {
      ...getMockSignedInAuthUserInfo(),
      token: 'another-token-appeared!',
    }
    const provider = wrapper.getWrappingComponent()
    provider.setProps({ value: newAuthUserInfo })

    expect(
      wrapper.find(ReactRelayContext.Provider).prop('value').environment
    ).toMatchObject({
      isMockRelayEnvironment: true,
      mockUserToken: 'another-token-appeared!',
    })
  })

  it('passes the Relay data (query props) to the child component', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      queryProps: {
        some: ['data', 'here'],
        abc: 123,
      },
    }
    const MockAuthProvider = getMockAuthProviderComponent()
    const wrapper = mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(wrapper.find(MockComponent).props()).toMatchObject({
      some: ['data', 'here'],
      abc: 123,
    })
  })

  it('passes additional props to the child component', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      extraneous: 'prop',
      thisIs: {
        extra: 'data',
      },
    }
    const MockAuthProvider = getMockAuthProviderComponent()
    const wrapper = mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(wrapper.find(MockComponent).props()).toMatchObject({
      extraneous: 'prop',
      thisIs: {
        extra: 'data',
      },
    })
  })

  it('calls getRelayQuery with the AuthUser value', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = getMockPropsForHOC()
    const mockAuthUserInfo = {
      ...getMockSignedInAuthUserInfo(),
      AuthUser: {
        ...getMockSignedInAuthUserInfo().AuthUser,
        uid: 'some-user-id',
        email: 'foo@example.com',
        emailVerified: true,
      },
      token: 'this-is-the-token',
    }
    const MockAuthProvider = getMockAuthProviderComponent({
      initialValue: mockAuthUserInfo,
    })
    mount(<HOC {...mockProps} />, {
      wrappingComponent: MockAuthProvider,
    })
    expect(mockRelayQueryGetter).toHaveBeenCalledWith({
      AuthUser: mockAuthUserInfo.AuthUser,
    })
  })

  // TODO: tests
  // - refetches data on mount if the "refetchDataOnMount" prop is true
  // - does not refetch data on mount if the "refetchDataOnMount" prop is true
  // - passes updated (refetched) data to the child component
  // - does not throw if the component unmounts before the refetched data returns
})

describe('withData: getInitialProps', () => {
  it("calls the wrapped component's getInitialProps with the Next.js context", async () => {
    expect.assertions(2)
    const withData = require('src/utils/pageWrappers/withData').default
    const ctx = getMockNextJSContext()
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    await HOC.getInitialProps(ctx)
    expect(MockComponent.getInitialProps).toHaveBeenCalledTimes(1)
    expect(MockComponent.getInitialProps).toHaveBeenCalledWith(ctx)
  })

  // TODO: tests
  // - calls initEnvironment with null token if empty AuthUserInfo
  // - calls initEnvironment with the token if there is AuthUserInfo
  // - calls getRelayQuery with the AuthUser value
  // - calls Relay's fetchQuery as expected if a query is provided
  // - does not call Relay's fetchQuery if no query is provided
  // - includes the wrapped component's props in returned props
  // - returns the fetchQuery response as the "queryProps" prop
  // - returns the environment's store records as the "queryRecords" prop
  // - sets the "refetchDataOnMount" to true if process.env.SERVICE_WORKER_ENABLED === 'true' and we are server-side
  // - sets the "refetchDataOnMount" to false if process.env.SERVICE_WORKER_ENABLED === 'false' and we are server-side
  // - sets the "refetchDataOnMount" to true if process.env.SERVICE_WORKER_ENABLED === 'true' but we are client-side
})

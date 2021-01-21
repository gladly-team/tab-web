import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'

jest.mock('next-firebase-auth')
jest.mock('src/utils/ssr')
jest.mock('src/utils/relayEnvironment')

// Quick fix to handle chained async hooks in `withRelay`.
const flushAndRerenderMultipleTimes = async (wrapper) => {
  await flushAllPromises()
  wrapper.setProps({})
  await flushAllPromises()
  wrapper.setProps({})
  await flushAllPromises()
  wrapper.setProps({})
}

// Support async hook updates to a mounted component.
// Adapted from:
// https://github.com/enzymejs/enzyme/issues/2073#issuecomment-543040614
const actions = async (wrapper, _actions = () => {}) => {
  await act(async () => {
    await flushAndRerenderMultipleTimes(wrapper)
    await _actions()
    await flushAndRerenderMultipleTimes(wrapper)
  })
}

beforeEach(() => {
  const { useAuthUser } = require('next-firebase-auth')
  useAuthUser.mockReturnValue(getMockAuthUser())
  const { isServerSide } = require('src/utils/ssr')
  isServerSide.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

// We originally approached this by trying to test on an
// unmocked Relay. See:
//   https://github.com/gladly-team/tab-web/blob/38a7a8c98da18fd10d9e4c39432edcbd2276caa9/src/utils/pageWrappers/__tests__/withRelay.test.js
// However, we ran into problems. It's possible the Relay state
// was leaking between tests, even when resetting modules.
// `jest.isolateModules` would potentially solve this problem,
// but it doesn't yet support async functions:
//   https://jestjs.io/docs/en/jest-object#jestisolatemodulesfn
//   https://github.com/facebook/jest/issues/10428
// Or, we may have also run into problems with multiple async hook
// updates that required multiple Promise flushes and re-renders,
// fixed subsequently with the `actions` wrapper above, and it
// would work now.
// As an alternative approach, we'll simply mock the Relay
// environment-- it's simpler but also tests internal
// implementation.

describe('withRelay', () => {
  it('provides the Relay environment via context', async () => {
    expect.assertions(2)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')

    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)

    // Mount with async hook:
    // https://github.com/enzymejs/enzyme/issues/2153#issuecomment-499219572
    const wrapper = mount(<MockCompWithRelay />)
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const RelayContextProvider = wrapper.find(ReactRelayContext.Provider)
    expect(RelayContextProvider.exists()).toBe(true)
    expect(RelayContextProvider.prop('value').environment).toMatchObject({
      // From our mock for relayEnvironment.js.
      _mockId: expect.any(String),
      store: expect.any(Object),
      network: expect.any(Object),
    })
  })

  it('uses the same Relay environment when rerendered with no changes', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')

    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)
    const wrapper = mount(<MockCompWithRelay />)
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const env1 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    await actions(wrapper, () => {
      wrapper.setProps({}) // force re-render
    })
    const env2 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    expect(env1).toEqual(env2)
  })

  it('[server-side] creates a new Relay environment even when rerendered with no changes', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(true) // server-side!

    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)
    const wrapper = mount(<MockCompWithRelay />)
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const env1 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment

    // Cause AuthUser to update to trigger the Relay environment
    // to initialize again, but keep the AuthUser ID/data the same.
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const env2 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    expect(env1).not.toEqual(env2)
  })

  it("creates a new Relay environment when the AuthUser's ID changes from non-null to null", async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)
    const wrapper = mount(<MockCompWithRelay />)
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const env1 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue({
        ...getMockAuthUser(),
        id: null,
        email: null,
      })
    })
    const env2 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    expect(env1).not.toEqual(env2)
  })

  it('does *not* create a new Relay store when rerendered with no changes', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)
    const wrapper = mount(<MockCompWithRelay />)
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const env1 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    await actions(wrapper, () => {
      wrapper.setProps({}) // force re-render
    })
    const env2 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    expect(env1.getStore()).toEqual(env2.getStore())
  })

  it("creates a new Relay store when the AuthUser's ID changes from non-null to null", async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)
    const wrapper = mount(<MockCompWithRelay />)
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const env1 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue({
        ...getMockAuthUser(),
        id: null,
        email: null,
      })
    })
    const env2 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment

    expect(env1.getStore()).not.toEqual(env2.getStore())
  })

  it("does *not* create a new Relay store when the AuthUser's ID changes from null to non-null", async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)
    useAuthUser.mockReturnValue({
      ...getMockAuthUser(),
      id: null,
      email: null,
    })
    const wrapper = mount(<MockCompWithRelay />)
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue({
        ...getMockAuthUser(),
        id: null,
        email: null,
      })
    })
    const env1 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    await actions(wrapper, () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
    })
    const env2 = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment
    expect(env1.getStore()).toEqual(env2.getStore())
  })

  it('passes "initialRecords" to the Relay store', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { ReactRelayContext } = require('react-relay')
    const MockComponent = () => <div>Hello!</div>
    const MockCompWithRelay = withRelay(MockComponent)

    // The initial records might be provided via `withDataSSR`,
    // for example.
    const mockInitialRecords = {
      'client:root': {
        __id: 'client:root',
        __typename: '__Root',
        app: { __ref: 'SomeFakeID' },
        'user(userId:"fakeUserId")': { __ref: 'AnotherFakeID' },
      },
      SomeFakeID: {
        __id: 'SomeFakeID',
        __typename: 'App',
        moneyRaised: 1066403.92,
        dollarsPerDayRate: 700,
        id: 'SomeFakeID',
      },
      AnotherFakeID: {
        __id: 'AnotherFakeID',
        __typename: 'User',
        tabs: 2237,
        vcCurrent: 538,
        id: 'AnotherFakeID',
      },
    }

    const wrapper = mount(
      <MockCompWithRelay initialRecords={mockInitialRecords} />
    )
    await actions(wrapper)
    const relayEnv = wrapper.find(ReactRelayContext.Provider).prop('value')
      .environment

    // Just a mock API from relayEnvironment.js.
    // eslint-disable-next-line no-underscore-dangle
    const storeRecords = relayEnv.getStore()._mockInitialRecords
    expect(storeRecords).toEqual(mockInitialRecords)
  })
})

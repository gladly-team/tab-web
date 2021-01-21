import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'

// Use the real react-relay.
jest.unmock('react-relay')
jest.unmock('relay-runtime')

// Note that we do not mock relayEnvironment.js.
jest.mock('next-firebase-auth')
jest.mock('src/utils/ssr')

beforeEach(() => {
  const { useAuthUser } = require('next-firebase-auth')
  const { isServerSide } = require('src/utils/ssr')
  const getMockAuthUser = require('src/utils/testHelpers/getMockAuthUser')
    .default
  useAuthUser.mockReturnValue(getMockAuthUser())
  isServerSide.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('withRelay', () => {
  it('provides the Relay environment via context', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { ReactRelayContext } = require('react-relay')
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default

    let relayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      return <div>Hello!</div>
    }
    const MockCompWithRelay = withRelay(MockComponent)

    // Mount with async hook:
    // https://github.com/enzymejs/enzyme/issues/2153#issuecomment-499219572
    await act(async () => {
      mount(<MockCompWithRelay />)
      await flushAllPromises()
    })
    expect(relayEnv).toEqual(expect.any(Object))
  })

  it('uses the same Relay environment when rerendered with no changes', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const usePrevious = require('src/utils/hooks/usePrevious').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const getMockAuthUser = require('src/utils/testHelpers/getMockAuthUser')
      .default
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default

    let relayEnv
    let previousRelayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      previousRelayEnv = usePrevious(relayEnv)
      return <div>Hello!</div>
    }
    const MockCompWithRelay = withRelay(MockComponent)
    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      const wrapper = mount(<MockCompWithRelay />)
      await flushAllPromises()
      wrapper.setProps({}) // force re-render
      await flushAllPromises()
    })
    expect(relayEnv).toEqual(previousRelayEnv)
  })

  it('[server-side] create a new Relay environment even when rerendered with no changes', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const usePrevious = require('src/utils/hooks/usePrevious').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const getMockAuthUser = require('src/utils/testHelpers/getMockAuthUser')
      .default
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default
    const { isServerSide } = require('src/utils/ssr')
    isServerSide.mockReturnValue(true) // server-side!
    let relayEnv
    let previousRelayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      previousRelayEnv = usePrevious(relayEnv)
      return <div>Hello!</div>
    }
    const MockCompWithRelay = withRelay(MockComponent)
    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      const wrapper = mount(<MockCompWithRelay />)
      await flushAllPromises()
      wrapper.setProps({}) // force re-render
      await flushAllPromises()
    })
    expect(relayEnv).not.toEqual(previousRelayEnv)
  })

  it("creates a new Relay environment when the AuthUser's ID changes from non-null to null", async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const usePrevious = require('src/utils/hooks/usePrevious').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const getMockAuthUser = require('src/utils/testHelpers/getMockAuthUser')
      .default
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default

    let relayEnv
    let previousRelayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      previousRelayEnv = usePrevious(relayEnv)
      return <div>Hello!</div>
    }
    const MockCompWithRelay = withRelay(MockComponent)
    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      const wrapper = mount(<MockCompWithRelay />)
      await flushAllPromises()
      useAuthUser.mockReturnValue({
        ...getMockAuthUser(),
        id: null,
        email: null,
      })
      await flushAllPromises()
      wrapper.setProps({}) // force re-render
      await flushAllPromises()
    })
    expect(relayEnv).not.toEqual(previousRelayEnv)
  })

  it('does *not* create a new Relay store when rerendered with no changes', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const usePrevious = require('src/utils/hooks/usePrevious').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const getMockAuthUser = require('src/utils/testHelpers/getMockAuthUser')
      .default
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default

    let relayEnv
    let previousRelayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      previousRelayEnv = usePrevious(relayEnv)
      return <div>Hello!</div>
    }
    const MockCompWithRelay = withRelay(MockComponent)
    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      const wrapper = mount(<MockCompWithRelay />)
      await flushAllPromises()
      wrapper.setProps({}) // force re-render
      await flushAllPromises()
    })
    expect(relayEnv.getStore()).toEqual(previousRelayEnv.getStore())
  })

  it("creates a new Relay store when the AuthUser's ID changes from non-null to null", async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const usePrevious = require('src/utils/hooks/usePrevious').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const getMockAuthUser = require('src/utils/testHelpers/getMockAuthUser')
      .default
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default

    let relayEnv
    let previousRelayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      previousRelayEnv = usePrevious(relayEnv)
      return <div>Hello!</div>
    }
    const MockCompWithRelay = withRelay(MockComponent)
    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      const wrapper = mount(<MockCompWithRelay />)
      await flushAllPromises()
      useAuthUser.mockReturnValue({
        ...getMockAuthUser(),
        id: null,
        email: null,
      })
      await flushAllPromises()
      wrapper.setProps({}) // force re-render
      await flushAllPromises()
    })
    expect(relayEnv.getStore()).not.toEqual(previousRelayEnv.getStore())
  })

  it("does *not* create a new Relay store when the AuthUser's ID changes from null to non-null", async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const usePrevious = require('src/utils/hooks/usePrevious').default
    const { useAuthUser } = require('next-firebase-auth')
    const { ReactRelayContext } = require('react-relay')
    const getMockAuthUser = require('src/utils/testHelpers/getMockAuthUser')
      .default
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default

    let relayEnv
    let previousRelayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      previousRelayEnv = usePrevious(relayEnv)
      return <div>Hello!</div>
    }
    const MockCompWithRelay = withRelay(MockComponent)
    await act(async () => {
      useAuthUser.mockReturnValue({
        ...getMockAuthUser(),
        id: null,
        email: null,
      })
      const wrapper = mount(<MockCompWithRelay />)
      await flushAllPromises()
      useAuthUser.mockReturnValue(getMockAuthUser())
      await flushAllPromises()
      wrapper.setProps({}) // force re-render
      await flushAllPromises()
    })
    expect(relayEnv.getStore()).toEqual(previousRelayEnv.getStore())
  })

  it('passes "initialRecords" to the Relay store', async () => {
    expect.assertions(1)
    const withRelay = require('src/utils/pageWrappers/withRelay').default
    const { ReactRelayContext } = require('react-relay')
    const flushAllPromises = require('src/utils/testHelpers/flushAllPromises')
      .default
    const { RecordSource } = require('relay-runtime')

    let relayEnv
    const MockComponent = () => {
      ;({ environment: relayEnv } = useContext(ReactRelayContext))
      return <div>Hello!</div>
    }
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
    await act(async () => {
      mount(<MockCompWithRelay initialRecords={mockInitialRecords} />)
      await flushAllPromises()
    })
    const storeRecords = relayEnv.getStore().getSource()
    expect(storeRecords).toMatchObject(new RecordSource(mockInitialRecords))
  })
})

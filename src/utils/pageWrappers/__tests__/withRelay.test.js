import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { useAuthUser } from 'next-firebase-auth'
import withRelay from 'src/utils/pageWrappers/withRelay'
import { ReactRelayContext } from 'react-relay'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'
import usePrevious from 'src/utils/hooks/usePrevious'

// Use the real react-relay.
jest.unmock('react-relay')
jest.unmock('relay-runtime')

jest.mock('next-firebase-auth')

beforeEach(() => {
  useAuthUser.mockReturnValue(getMockAuthUser())
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('withRelay', () => {
  it('provides the Relay environment via context', async () => {
    expect.assertions(1)

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

  it("creates a new Relay environment when the AuthUser's ID changes from non-null to null", async () => {
    expect.assertions(1)

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
})

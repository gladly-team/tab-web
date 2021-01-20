import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { useAuthUser } from 'next-firebase-auth'
import withRelay from 'src/utils/pageWrappers/withRelay'
import { ReactRelayContext } from 'react-relay'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'

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
      const wrapper = mount(<MockCompWithRelay />)
      await flushAllPromises()
    })
    expect(relayEnv).toEqual(expect.any(Object))
  })
})

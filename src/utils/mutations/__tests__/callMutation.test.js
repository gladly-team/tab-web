import { commitMutation as commitMutationDefault } from 'react-relay'
import {
  getRelayEnvironment,
  waitForAuthInitialized,
} from 'src/utils/relayEnvironment'
import { isServerSide } from 'src/utils/ssr'
import { recachePage } from 'src/utils/caching'
import flushAllPromises from 'src/utils/testHelpers/flushAllPromises'

jest.mock('react-relay')
jest.mock('src/utils/relayEnvironment')
jest.mock('src/utils/ssr')
jest.mock('src/utils/caching')

beforeEach(() => {
  commitMutationDefault.mockImplementation((environment, options) => {
    // Immediately call onCompleted.
    options.onCompleted({
      myMutation: {
        response: 'data',
      },
    })
  })
  isServerSide.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('callMutation', () => {
  it('calls getRelayEnvironment', async () => {
    expect.assertions(1)
    const callMutation = require('src/utils/mutations/callMutation').default
    await callMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
    })
    expect(getRelayEnvironment).toHaveBeenCalled()
  })

  it('waits for client auth to load before calling `getRelayEnvironment` or `commitMutation`', async () => {
    expect.assertions(4)
    let resolver
    waitForAuthInitialized.mockImplementationOnce(
      async () =>
        new Promise((resolve) => {
          resolver = resolve
        })
    )
    const callMutation = require('src/utils/mutations/callMutation').default
    callMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
    })
    await flushAllPromises()
    expect(getRelayEnvironment).not.toHaveBeenCalled()
    expect(commitMutationDefault).not.toHaveBeenCalled()
    resolver()
    await flushAllPromises()
    expect(getRelayEnvironment).toHaveBeenCalled()
    expect(commitMutationDefault).toHaveBeenCalled()
  })

  it('recaches the page by default', async () => {
    expect.assertions(1)
    const callMutation = require('src/utils/mutations/callMutation').default
    await callMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
    })
    expect(recachePage).toHaveBeenCalled()
  })

  it('does not recache the page when cache param is set to false', async () => {
    expect.assertions(1)
    const callMutation = require('src/utils/mutations/callMutation').default
    await callMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
      cache: false,
    })
    expect(recachePage).not.toHaveBeenCalled()
  })

  it("calls react-relay's `commitMutation` with the Relay environment and expected options", async () => {
    expect.assertions(1)
    getRelayEnvironment.mockReturnValue({
      thisIsAFakeEnvironment: true,
    })
    const callMutation = require('src/utils/mutations/callMutation').default
    await callMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
    })
    expect(commitMutationDefault).toHaveBeenCalledWith(
      {
        thisIsAFakeEnvironment: true,
      },
      {
        mutation: { some: 'stuff' },
        variables: { myVars: 'here' },
        onCompleted: expect.any(Function),
        onError: expect.any(Function),
      }
    )
  })

  it("resolves into the response data when react-relay's `commitMutation` calls onCompleted", async () => {
    expect.assertions(1)
    commitMutationDefault.mockImplementation((environment, options) => {
      // Immediately call onCompleted.
      options.onCompleted({
        myMutation: {
          response: 'data',
          coolStuff: ['very', 'cool'],
        },
      })
    })
    const callMutation = require('src/utils/mutations/callMutation').default
    const response = await callMutation({
      mutation: { some: 'stuff' },
      variables: { myVars: 'here' },
    })
    expect(response).toEqual({
      myMutation: {
        response: 'data',
        coolStuff: ['very', 'cool'],
      },
    })
  })

  it("rejects when react-relay's `commitMutation` calls onError", async () => {
    expect.assertions(1)
    const mockErr = new Error('I had a fear of commitment.')
    commitMutationDefault.mockImplementation((environment, options) => {
      // Immediately call onError.
      options.onError(mockErr)
    })
    const callMutation = require('src/utils/mutations/callMutation').default
    await expect(
      callMutation({
        mutation: { some: 'stuff' },
        variables: { myVars: 'here' },
      })
    ).rejects.toEqual(mockErr)
  })

  it('throws if called on the server side', async () => {
    expect.assertions(1)
    isServerSide.mockReturnValue(true)
    const callMutation = require('src/utils/mutations/callMutation').default
    await expect(
      callMutation({
        mutation: { some: 'stuff' },
        variables: { myVars: 'here' },
      })
    ).rejects.toEqual(new Error('Mutations must only be called on the client.'))
  })
})

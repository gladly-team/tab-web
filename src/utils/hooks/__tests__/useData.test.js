import { act, renderHook } from '@testing-library/react-hooks'
import { fetchQuery } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import * as useSWR from 'swr'
import useData from 'src/utils/hooks/useData'
import {
  initRelayEnvironment,
  getRelayEnvironment,
} from 'src/utils/relayEnvironment'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

// We don't mock SWR but instead the underlying fetcher.
jest.mock('react-relay')
jest.mock('next-firebase-auth')
jest.mock('src/utils/relayEnvironment')

const getUninitializedAuthUser = () => ({
  ...getMockAuthUser(),
  id: null,
  email: null,
  clientInitialized: false,
})

beforeEach(() => {
  initRelayEnvironment()
  fetchQuery.mockImplementation(async (environment, query) => {
    if (!environment) {
      throw new Error('fetchQuery needs a Relay environment.')
    }
    if (!query) {
      return {}
    }
    // Some mock data.
    return {
      user: {
        tabs: 123,
        username: 'MyUsername',
      },
    }
  })
  jest.clearAllMocks()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('useData', () => {
  it('returns fetched data when auth has initialized and a query is provided', async () => {
    expect.assertions(1)

    // Defer any state-affecting logic.
    useAuthUser.mockReturnValue(getUninitializedAuthUser())
    let relayQueryPromiseResolver
    const relayQueryPromise = new Promise((resolve) => {
      relayQueryPromiseResolver = resolve
    })
    const getRelayVariables = async () => relayQueryPromise

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useData({ relayQuery: 'query', getRelayVariables })
    )

    // Update logic that affects the `useData` state.
    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      relayQueryPromiseResolver({
        some: 'thing',
      })
      rerender()

      // https://github.com/testing-library/react-hooks-testing-library/issues/14#issuecomment-480225170
      await waitForNextUpdate()
    })
    expect(result.current).toEqual({
      data: {
        user: {
          tabs: 123,
          username: 'MyUsername',
        },
      },
      error: undefined,
    })
  })

  it('returns undefined data when auth has not yet initialized', async () => {
    expect.assertions(1)

    // We will not initialize the AuthUser.
    useAuthUser.mockReturnValue(getUninitializedAuthUser())

    let relayQueryPromiseResolver
    const relayQueryPromise = new Promise((resolve) => {
      relayQueryPromiseResolver = resolve
    })
    const getRelayVariables = async () => relayQueryPromise

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useData({ relayQuery: 'query', getRelayVariables })
    )

    await act(async () => {
      relayQueryPromiseResolver({
        query: `some query here`,
        variables: {
          some: 'thing',
        },
      })
      rerender()
      await waitForNextUpdate()
    })
    expect(result.current).toEqual({
      data: undefined,
      error: undefined,
    })
  })

  it('returns undefined data when no query is provided', async () => {
    expect.assertions(1)

    // We will not initialize the AuthUser.
    useAuthUser.mockReturnValue(getUninitializedAuthUser())

    let relayQueryPromiseResolver
    const relayQueryPromise = new Promise((resolve) => {
      relayQueryPromiseResolver = resolve
    })
    const getRelayVariables = async () => relayQueryPromise

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useData({ getRelayVariables })
    )

    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      relayQueryPromiseResolver({}) // no query provideed
      rerender()
      await waitForNextUpdate()
    })
    expect(result.current).toEqual({
      data: undefined,
      error: undefined,
    })
  })

  it('provides an authed AuthUser to `getRelayQuery`', async () => {
    expect.assertions(1)

    useAuthUser.mockReturnValue(getUninitializedAuthUser())
    let relayQueryPromiseResolver
    const relayQueryPromise = new Promise((resolve) => {
      relayQueryPromiseResolver = resolve
    })
    const mockGetRelayVariables = jest.fn(async () => relayQueryPromise)

    const { rerender, waitForNextUpdate } = renderHook(() =>
      useData({ relayQuery: 'query', getRelayVariables: mockGetRelayVariables })
    )

    const mockAuthUser = getMockAuthUser()
    await act(async () => {
      useAuthUser.mockReturnValue(mockAuthUser)
      relayQueryPromiseResolver({
        query: `some query here`,
        variables: {
          some: 'thing',
        },
      })
      rerender()
      await waitForNextUpdate()
    })
    expect(mockGetRelayVariables).toHaveBeenCalledWith({
      AuthUser: mockAuthUser,
    })
  })

  it('provides an unauthed (but initialized) AuthUser to `getRelayQuery`', async () => {
    expect.assertions(1)

    useAuthUser.mockReturnValue(getUninitializedAuthUser())
    let relayQueryPromiseResolver
    const relayQueryPromise = new Promise((resolve) => {
      relayQueryPromiseResolver = resolve
    })
    const mockGetRelayVariables = jest.fn(async () => relayQueryPromise)

    const { rerender, waitForNextUpdate } = renderHook(() =>
      useData({ getRelayVariables: mockGetRelayVariables })
    )

    const mockAuthUser = {
      ...getMockAuthUser(),
      id: null,
      email: null,
      clientInitialized: true,
    }
    await act(async () => {
      useAuthUser.mockReturnValue(mockAuthUser)
      relayQueryPromiseResolver({
        query: `some query here`,
        variables: {
          some: 'thing',
        },
      })
      rerender()
      await waitForNextUpdate()
    })
    expect(mockGetRelayVariables).toHaveBeenCalledWith({
      AuthUser: mockAuthUser,
    })
  })

  xit('returns an error if fetchQuery throws', async () => {
    expect.assertions(1)

    const mockErr = new Error('Problem fetching data.')
    fetchQuery.mockImplementation(async () => {
      throw mockErr
    })

    useAuthUser.mockReturnValue(getUninitializedAuthUser())
    let relayQueryPromiseResolver
    const relayQueryPromise = new Promise((resolve) => {
      relayQueryPromiseResolver = resolve
    })
    const mockGetRelayVariables = async () => relayQueryPromise

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useData({
        relayQuery: 'some query',
        getRelayVariables: mockGetRelayVariables,
      })
    )

    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      relayQueryPromiseResolver({
        query: `some query here`,
        variables: {
          some: 'thing',
        },
      })
      rerender()
      await waitForNextUpdate()
    })
    expect(result.current).toEqual({
      data: undefined,
      error: mockErr,
    })
  })

  it('throws an error if not wrapped in the `withAuthUser` HOC', async () => {
    expect.assertions(1)
    useAuthUser.mockReturnValue(undefined)
    const mockGetRelayVariables = async () => ({
      variables: {},
    })
    const { result } = renderHook(() =>
      useData({ relayQuery:'some query here', getRelayVariables: mockGetRelayVariables })
    )
    expect(result.error).toEqual(
      new Error(
        'The `useData` HOC should be wrapped in the `withAuthUser` HOC.'
      )
    )
  })

  // it('returns an error if `getRelayEnvironment` throws', async () => {
  //   expect.assertions(1)

  //   const mockErr = new Error('Problem with the Relay environment.')
  //   getRelayEnvironment.mockImplementation(() => {
  //     throw mockErr
  //   })

  //   useAuthUser.mockReturnValue(getUninitializedAuthUser())
  //   let relayQueryPromiseResolver
  //   const relayQueryPromise = new Promise((resolve) => {
  //     relayQueryPromiseResolver = resolve
  //   })
  //   const mockGetRelayQuery = async () => relayQueryPromise

  //   const { result, rerender, waitForNextUpdate } = renderHook(() =>
  //     useData({ getRelayQuery: mockGetRelayQuery })
  //   )

  //   await act(async () => {
  //     useAuthUser.mockReturnValue(getMockAuthUser())
  //     relayQueryPromiseResolver({
  //       query: `some query here`,
  //       variables: {
  //         some: 'thing',
  //       },
  //     })
  //     rerender()
  //     await waitForNextUpdate()
  //   })
  //   expect(result.current).toEqual({
  //     data: undefined,
  //     error: mockErr,
  //   })
  // })

  // it('passes initialData and additional options to `useSWR`', async () => {
  //   expect.assertions(1)

  //   // Spying on default exports:
  //   // https://stackoverflow.com/a/54245672
  //   const useSWRSpy = jest.spyOn(useSWR, 'default')

  //   useAuthUser.mockReturnValue(getUninitializedAuthUser())
  //   let relayQueryPromiseResolver
  //   const relayQueryPromise = new Promise((resolve) => {
  //     relayQueryPromiseResolver = resolve
  //   })
  //   const mockGetRelayQuery = async () => relayQueryPromise

  //   const { rerender, waitForNextUpdate } = renderHook(() =>
  //     useData({
  //       getRelayQuery: mockGetRelayQuery,
  //       // Setting some additional SWR options.
  //       initialData: { some: 'initial data' },
  //       errorRetryCount: 2,
  //       revalidateOnMount: true,
  //     })
  //   )
  //   await act(async () => {
  //     useAuthUser.mockReturnValue(getMockAuthUser())
  //     relayQueryPromiseResolver({
  //       query: `some query here`,
  //       variables: {
  //         some: 'thing',
  //       },
  //     })
  //     rerender()
  //     await waitForNextUpdate()
  //   })

  //   expect(useSWRSpy).toHaveBeenCalledWith(
  //     expect.any(Function),
  //     expect.any(Function),
  //     {
  //       initialData: { some: 'initial data' },
  //       errorRetryCount: 2,
  //       revalidateOnMount: true,
  //     }
  //   )
  // })
})

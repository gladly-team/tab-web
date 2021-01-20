import { act, renderHook } from '@testing-library/react-hooks'
import { fetchQuery } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import useData from 'src/utils/hooks/useData'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

// We don't mock SWR but instead the underlying fetcher.
jest.mock('react-relay')
jest.mock('next-firebase-auth')
jest.mock('src/utils/relayEnvironment')

const getUnauthedAuthUser = () => ({
  ...getMockAuthUser(),
  id: null,
  email: null,
  clientInitialized: false,
})

beforeEach(() => {
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
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('useData', () => {
  it('returns fetched data', async () => {
    expect.assertions(1)

    // Defer any state-affecting logic.
    useAuthUser.mockReturnValue(getUnauthedAuthUser())
    let relayQueryPromiseResolver
    const relayQueryPromise = new Promise((resolve) => {
      relayQueryPromiseResolver = resolve
    })
    const mockGetRelayQuery = async () => relayQueryPromise

    const { result, rerender, waitForNextUpdate } = renderHook(() =>
      useData({ getRelayQuery: mockGetRelayQuery })
    )

    // Update logic that affects the `useData` state.
    await act(async () => {
      useAuthUser.mockReturnValue(getMockAuthUser())
      relayQueryPromiseResolver({
        query: `some query here`,
        variables: {
          some: 'thing',
        },
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
})

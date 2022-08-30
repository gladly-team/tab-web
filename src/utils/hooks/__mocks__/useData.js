const useData = jest.fn(({ getRelayQuery, fallbackData }) => {
  if (!getRelayQuery) {
    throw new Error(
      'Validation in mock: `useData` expects a value for "getRelayQuery.'
    )
  }
  if (typeof getRelayQuery !== 'function') {
    throw new Error(
      'Validation in mock: `useData` expects a function for "getRelayQuery.'
    )
  }
  return { data: fallbackData, error: undefined, isDataFresh: false }
})

export default useData

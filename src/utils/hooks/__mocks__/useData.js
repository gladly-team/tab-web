const useData = jest.fn(({ getRelayQuery, initialData }) => {
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
  return { data: initialData, error: undefined }
})

export default useData

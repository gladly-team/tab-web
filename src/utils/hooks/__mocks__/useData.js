const useData = jest.fn(({ getRelayVariables, initialData }) => {
  if (!getRelayVariables) {
    throw new Error(
      'Validation in mock: `useData` expects a value for "getRelayVariables.'
    )
  }
  if (typeof getRelayVariables !== 'function') {
    throw new Error(
      'Validation in mock: `useData` expects a function for "getRelayVariables.'
    )
  }
  return { data: initialData, error: undefined }
})

export default useData

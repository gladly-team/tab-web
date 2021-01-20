const useData = jest.fn(({ initialData }) => ({
  data: initialData,
  error: undefined,
}))

export default useData

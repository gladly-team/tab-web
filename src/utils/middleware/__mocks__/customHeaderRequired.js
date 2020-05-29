export default jest.fn((handler) => async (req, res) => {
  return handler(req, res)
})

export const withSession = jest.fn((req) => {
  req.session = undefined
})

export default jest.fn((handler) => (req, res) => {
  withSession(req)
  handler(req, res)
})

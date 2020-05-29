export const withCookies = jest.fn((req) => {
  req.cookie = {
    get: () => undefined,
    set: jest.fn(() => {}),
  }
})

export default jest.fn((handler) => (req, res) => {
  withCookies(req)
  handler(req, res)
})

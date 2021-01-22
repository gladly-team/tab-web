const addUserFromAuthorizationToken = jest.fn((handler) => async (req, res) =>
  handler(req, res)
)

export default addUserFromAuthorizationToken

// FIXME: use next-firebase-auth
//   Maybe refactor to not use request key and instead
//   just take an AuthUser argument?

// Requires an authorized user.
export default (handler) => async (req, res) => {
  // const AuthUserInfo = get(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_INFO_KEY])
  const AuthUser = undefined
  const token = undefined

  if (!(token && AuthUser && AuthUser.id)) {
    return res.status(400).json({ success: false })
  }
  return handler(req, res)
}

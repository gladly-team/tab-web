import { set } from 'lodash/object'

const tabDataKey = 'tab'

// Adds a tab.user object to the request.
export default handler => (req, res) => {
  try {
    set(req, [tabDataKey, 'user'], {
      some: 'user',
    })
  } catch (e) {
    // TODO: log error
    return res
      .status(500)
      .json({ error: 'Could not get the user from the Authorization header.' })
  }
  return handler(req, res)
}

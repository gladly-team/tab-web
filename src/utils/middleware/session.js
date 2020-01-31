// TODO
export const addSession = (req, res) => {
  // const sessionCookieName = 'tabWebSession'

  try {
    // TODO
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
    throw e
  }
}

export default handler => (req, res) => {
  try {
    addSession(req, res)
  } catch (e) {
    return res.status(500).json({ error: 'Could not get user session.' })
  }
  return handler(req, res)
}

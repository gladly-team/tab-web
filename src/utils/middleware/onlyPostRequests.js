// Only allow POST requests.
export default (handler) => async (req, res) => {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: `This request method is not allowed.` })
  }
  return handler(req, res)
}

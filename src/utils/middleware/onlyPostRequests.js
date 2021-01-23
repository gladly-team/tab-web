// Only allow POST requests.
const onlyPostRequests = (handler) => async (req, res) => {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ error: `This request method is not allowed.` })
  }
  return handler(req, res)
}

export default onlyPostRequests

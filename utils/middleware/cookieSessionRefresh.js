// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
module.exports = handler => (req, res) => {
  if (req.session) {
    req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  }
  handler(req, res)
}

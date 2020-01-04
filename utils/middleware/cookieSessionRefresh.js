// Update a value in the cookie so that the set-cookie will be sent.
// Only changes every minute so that it's not sent with every request.
module.exports = (req, res, next) => {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3)
  next()
}

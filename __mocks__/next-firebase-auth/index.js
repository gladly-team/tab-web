const withAuthUser = require('./withAuthUser').default
const useAuthUser = require('./useAuthUser').default
const withAuthUserSSR = require('./withAuthUserSSR').default
const withAuthUserTokenSSR = require('./withAuthUserTokenSSR').default
const verifyIdToken = require('./verifyIdToken').default

module.exports = {
  init: jest.fn(),
  withAuthUser,
  useAuthUser,
  withAuthUserSSR,
  withAuthUserTokenSSR,
  setAuthCookies: jest.fn(),
  unsetAuthCookies: jest.fn(),
  verifyIdToken,
  AuthAction: {},
}

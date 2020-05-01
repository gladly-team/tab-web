/* eslint-env jest */

const actual = require.requireActual('src/utils/auth/user')
const mock = jest.genMockFromModule('src/utils/auth/user')
module.exports = {
  ...mock,
  createAuthUser: actual.createAuthUser,
  createAuthUserInfo: actual.createAuthUserInfo,
  // By default, return an empty AuthUserInfo object.
  getAuthUserInfoFromDOM: jest.fn(() => actual.createAuthUserInfo()),
}

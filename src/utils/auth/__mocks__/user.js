// Seem like module-resolver doesn't currently handle
// jest.requireActual:
// https://github.com/facebook/jest/issues/8958
const actual = jest.requireActual('../user')

const mock = jest.createMockFromModule('../user')
module.exports = {
  ...mock,
  createAuthUser: actual.createAuthUser,
  createAuthUserInfo: actual.createAuthUserInfo,
  // By default, return an empty AuthUserInfo object.
  getAuthUserInfoFromDOM: jest.fn(() => actual.createAuthUserInfo()),
}

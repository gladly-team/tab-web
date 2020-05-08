/* eslint-env jest */
import { createAuthUserInfo } from 'src/utils/auth/user'

const mock = jest.genMockFromModule('src/utils/auth/hooks')

mock.useAuthUserInfo = jest.fn(() => createAuthUserInfo())

module.exports = mock

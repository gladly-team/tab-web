import React from 'react'
import { createAuthUserInfo } from 'src/utils/auth/user'

const mock = jest.createMockFromModule('../hooks')

const AuthUserInfoContext = React.createContext(createAuthUserInfo())
const useAuthUserInfo = jest.fn(() => React.useContext(AuthUserInfoContext))

mock.AuthUserInfoContext = AuthUserInfoContext
mock.useAuthUserInfo = useAuthUserInfo

module.exports = mock

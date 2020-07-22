import React from 'react'
import { createAuthUserInfo } from 'src/utils/auth/user'

const mock = {}

const AuthUserInfoContext = React.createContext(createAuthUserInfo())
const useAuthUserInfo = jest.fn(() => React.useContext(AuthUserInfoContext))

mock.AuthUserInfoContext = AuthUserInfoContext
mock.useAuthUserInfo = useAuthUserInfo

mock.useFirebaseAuth = jest.fn()

module.exports = mock

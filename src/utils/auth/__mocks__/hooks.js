/* eslint-env jest */
import React from 'react'
import { createAuthUserInfo } from 'src/utils/auth/user'

const mock = jest.genMockFromModule('src/utils/auth/hooks')

const AuthUserInfoContext = React.createContext(createAuthUserInfo())
const useAuthUserInfo = jest.fn(() => React.useContext(AuthUserInfoContext))

mock.AuthUserInfoContext = AuthUserInfoContext
mock.useAuthUserInfo = useAuthUserInfo

module.exports = mock

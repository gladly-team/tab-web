import React from 'react'
import { shallow } from 'enzyme'
import { useFirebaseAuth } from 'src/utils/auth/hooks'
import { isClientSide, isServerSide } from 'src/utils/ssr'

jest.mock('next-offline/runtime')
jest.mock('src/utils/auth/hooks')
jest.mock('src/utils/auth/user')
jest.mock('src/utils/middleware/session')
jest.mock('src/utils/ssr')

const MockComponent = () => {
  return <div>hi</div>
}

const getMockProps = () => ({
  AuthUserInfo: {
    AuthUser: {
      id: 'abc-123',
      email: 'fake@example.com',
      emailVerified: true,
    },
    token: 'some-token-here',
  },
  Component: MockComponent,
  pageProps: { some: 'data' },
})

beforeEach(() => {
  useFirebaseAuth.mockReturnValue({
    initializing: true,
    user: {
      uid: 'abc-123',
      email: 'fake@example.com',
      emailVerified: true,
    },
  })
  isClientSide.mockReturnValue(true)
  isServerSide.mockReturnValue(false)
})

describe('_app.js', () => {
  it('renders without error', () => {
    const App = require('src/pages/_app.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<App {...mockProps} />)
    }).not.toThrow()
  })
})

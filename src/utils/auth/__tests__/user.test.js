/* eslint-env jest */

import { createAuthUserInfo } from 'src/utils/auth/user'

// The Firebase user from the JS SDK.
const getMockFirebaseClientUser = () => ({
  uid: 'abc-123',
  email: 'fakeemail@example.com',
  emailVerified: false,
})

// The user from the decoded Firebase token.
const getMockFirebaseServerUser = () => ({
  uid: 'abc-123',
  email: 'fakeemail@example.com',
  email_verified: false, // note the different key
})

describe('createAuthUserInfo', () => {
  it('constructs the expected AuthUserInfo when passed a client-side firebaseUser', () => {
    expect.assertions(1)
    expect(
      createAuthUserInfo({
        firebaseUser: getMockFirebaseClientUser(),
        token: 'my-token-123',
      })
    ).toEqual({
      AuthUser: {
        id: 'abc-123',
        email: 'fakeemail@example.com',
        emailVerified: false,
      },
      isClientInitialized: false,
      token: 'my-token-123',
    })
  })

  it('constructs the expected AuthUserInfo when passed a server-side firebaseUser', () => {
    expect.assertions(1)
    expect(
      createAuthUserInfo({
        firebaseUser: getMockFirebaseServerUser(),
        token: 'my-token-123',
      })
    ).toEqual({
      AuthUser: {
        id: 'abc-123',
        email: 'fakeemail@example.com',
        emailVerified: false,
      },
      isClientInitialized: false,
      token: 'my-token-123',
    })
  })
})

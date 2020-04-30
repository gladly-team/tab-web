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
        isClientInitialized: false,
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
        isClientInitialized: false,
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

  it('constructs the expected AuthUserInfo when passed an existing AuthUser object', () => {
    expect.assertions(1)
    expect(
      createAuthUserInfo({
        AuthUser: {
          id: '9988776655',
          email: 'anotherfakeemail@example.com',
          emailVerified: false,
        },
        token: 'my-token-123',
        isClientInitialized: false,
      })
    ).toEqual({
      AuthUser: {
        id: '9988776655',
        email: 'anotherfakeemail@example.com',
        emailVerified: false,
      },
      isClientInitialized: false,
      token: 'my-token-123',
    })
  })

  it('throws if provided both the AuthUserInfo and firebaseUser arguments', () => {
    expect.assertions(1)
    expect(() => {
      createAuthUserInfo({
        AuthUser: {
          id: '9988776655',
          email: 'anotherfakeemail@example.com',
          emailVerified: false,
        },
        firebaseUser: getMockFirebaseClientUser(),
        token: 'my-token-123',
        isClientInitialized: false,
      })
    }).toThrow(
      'Pass either AuthUser or firebaseUser, not both, when constructing AuthUserInfo'
    )
  })

  it('defaults to isClientInitialized === false', () => {
    expect.assertions(1)
    const AuthUserInfo = createAuthUserInfo({
      firebaseUser: getMockFirebaseClientUser(),
      token: 'my-token-123',
      // isClientInitialized: false, // not provided
    })
    expect(AuthUserInfo.isClientInitialized).toBe(false)
  })

  it('sets isClientInitialized === true when provided', () => {
    expect.assertions(1)
    const AuthUserInfo = createAuthUserInfo({
      firebaseUser: getMockFirebaseClientUser(),
      token: 'my-token-123',
      isClientInitialized: true,
    })
    expect(AuthUserInfo.isClientInitialized).toBe(true)
  })
})

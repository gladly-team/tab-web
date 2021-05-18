// This HOC should be wrapped in `withAuthUser`.

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ReactRelayContext } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import { initRelayEnvironment } from 'src/utils/relayEnvironment'
import usePrevious from 'src/utils/hooks/usePrevious'

const expiredToken = 'token-here'

const mockUnauthedUser = {
  id: null,
  email: null,
  emailVerified: false,
  getIdToken: async () => expiredToken, // mutations throw with "message: null"
  clientInitialized: false,
  firebaseUser: {},
  signOut: () => {},
  serialize: () => {},
}

// Mock a delay in loading Firebase client.
const useMockAuthUser = () => {
  const [user, setUser] = useState(mockUnauthedUser)
  const realAuthUser = useAuthUser()
  setTimeout(() => {
    setUser(realAuthUser)
  }, 3000)
  return user
}

const withRelay = (ChildComponent) => {
  const WithRelayHOC = (props) => {
    const { initialRecords, ...otherProps } = props

    const AuthUser = useMockAuthUser()
    console.log(AuthUser)

    // Publish initial records to the store only if they've
    // changed. Otherwise, old initial records might overwrite
    // new store data.
    const previousInitialRecords = usePrevious(initialRecords)
    const publishInitialRecords = previousInitialRecords !== initialRecords

    // Set up the Relay environment.
    const [relayEnvironment, setRelayEnvironment] = useState(
      initRelayEnvironment({
        initialRecords,
        getIdToken: AuthUser.getIdToken,
        publishInitialRecords,
      })
    )

    // Update the Relay environment when the AuthUser changes.
    const previousAuthUser = usePrevious(AuthUser)
    useEffect(() => {
      const updateRelayEnvAsNeeded = async () => {
        const token = await AuthUser.getIdToken()
        const oldToken = previousAuthUser
          ? await previousAuthUser.getIdToken()
          : null
        const oldId = previousAuthUser ? previousAuthUser.id : null

        // If the AuthUser's token or ID change, recreate the
        // Relay network.
        const shouldRecreateNetwork =
          AuthUser.id !== oldId || token !== oldToken

        // If the AuthUser's ID changes, recreate the Relay store.
        // Don't recreate the store if the previous user ID wasn't
        // set, because we were likely just waiting for the auth
        // client to initialize.
        const shouldRecreateStore =
          !oldId && AuthUser.id ? false : AuthUser.id !== oldId

        setRelayEnvironment(
          initRelayEnvironment({
            getIdToken: AuthUser.getIdToken,
            recreateNetwork: shouldRecreateNetwork,
            recreateStore: shouldRecreateStore,
            publishInitialRecords,
          })
        )
      }
      updateRelayEnvAsNeeded()
    }, [AuthUser, previousAuthUser, publishInitialRecords])

    return (
      <ReactRelayContext.Provider
        value={{ environment: relayEnvironment, variables: {} }}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ChildComponent {...otherProps} />
      </ReactRelayContext.Provider>
    )
  }

  WithRelayHOC.displayName = 'WithRelayHOC'

  WithRelayHOC.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    initialRecords: PropTypes.object,
  }

  WithRelayHOC.defaultProps = {
    initialRecords: undefined,
  }

  return WithRelayHOC
}

export default withRelay

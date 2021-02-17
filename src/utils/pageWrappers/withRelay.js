// This HOC should be wrapped in `withAuthUser`.

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ReactRelayContext } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import { initRelayEnvironment } from 'src/utils/relayEnvironment'
import usePrevious from 'src/utils/hooks/usePrevious'

const withRelay = (ChildComponent) => {
  const WithRelayHOC = (props) => {
    const { initialRecords, ...otherProps } = props
    const AuthUser = useAuthUser()

    // Set up the Relay environment.
    const [relayEnvironment, setRelayEnvironment] = useState(
      initRelayEnvironment({
        initialRecords,
        getIdToken: AuthUser.getIdToken,
      })
    )

    const previousInitialRecords = usePrevious(initialRecords)

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

        // Publish initial records to the store only if they've
        // changed. Otherwise, old initial records might overwrite
        // new store data.
        const shouldPublishInitialRecords =
          previousInitialRecords !== initialRecords

        // Debugging only
        // eslint-disable-next-line no-console
        console.log(
          'Debugging: Recreating Relay network:',
          shouldRecreateNetwork
        )

        // Debugging only
        // eslint-disable-next-line no-console
        console.log('Debugging: Recreating Relay store:', shouldRecreateStore)

        // Debugging only
        // eslint-disable-next-line no-console
        console.log(
          'Debugging: Relay shouldPublishInitialRecords',
          shouldPublishInitialRecords
        )

        // Debugging only
        // eslint-disable-next-line no-console
        console.log(
          'Debugging: Relay records:',
          previousInitialRecords,
          initialRecords
        )

        setRelayEnvironment(
          initRelayEnvironment({
            getIdToken: AuthUser.getIdToken,
            recreateNetwork: shouldRecreateNetwork,
            recreateStore: shouldRecreateStore,
            publishInitialRecords: shouldPublishInitialRecords,
          })
        )
      }
      updateRelayEnvAsNeeded()
    }, [AuthUser, previousAuthUser, initialRecords, previousInitialRecords])

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

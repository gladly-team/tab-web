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

    // Update the Relay environment when the AuthUser changes.
    const previousAuthUser = usePrevious(AuthUser)
    useEffect(() => {
      const updateRelayEnvAsNeeded = async () => {
        const token = await AuthUser.getIdToken()
        const oldToken = previousAuthUser
          ? await previousAuthUser.getIdToken()
          : null
        const oldId = previousAuthUser ? previousAuthUser.id : null

        // If the AuthUser's ID changes, recreate the Relay store
        // and network. Don't recreate the store if the previous user
        // ID wasn't set because we were likely just waiting for the
        // auth client to initialize.
        const shouldRecreateStore =
          !oldId && AuthUser.id ? false : AuthUser.id !== oldId
        setRelayEnvironment(
          initRelayEnvironment({
            getIdToken: AuthUser.getIdToken,
            // If the AuthUser's token or ID change, recreate the
            // Relay network.
            recreateNetwork: AuthUser.id !== oldId || token !== oldToken,
            recreateStore: shouldRecreateStore,
          })
        )
      }
      updateRelayEnvAsNeeded()
    }, [AuthUser, previousAuthUser])

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
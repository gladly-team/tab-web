import React from 'react'
import PropTypes from 'prop-types'
import { ReactRelayContext } from 'react-relay'
import { useAuthUser } from 'next-firebase-auth'
import { initRelayEnvironment } from 'src/utils/relayEnvironment'

// Should be wrapped in `withAuthUser` context.
const withRelay = (ChildComponent) => {
  const WithRelayHOC = (props) => {
    // Set up the Relay environment.

    const AuthUser = useAuthUser()

    // TODO:
    // If the AuthUser's ID changes, recreate the Relay store
    // and network.
    // If the AuthUser's token changes, recreate the Relay network.

    const { initialRecords, ...otherProps } = props

    const relayEnvironment = initRelayEnvironment({
      records: initialRecords,
      getIdToken: AuthUser.getIdToken,
      recreateNetwork: true, // FIXME
    })

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

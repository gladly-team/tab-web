/* eslint react/jsx-props-no-spreading: 0 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from './createRelayEnvironment'

// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

export default (ComposedComponent, getRelayQuery) => {
  const WithDataComp = props => {
    const { authUser, queryRecords, ...otherProps } = props
    const [environment] = useState(
      initEnvironment({
        records: queryRecords,
      })
    )

    // Get the Relay query and variables config. We pass the authUser
    // so the child component can use the user ID in the query, if needed.
    const { variables = {} } = getRelayQuery(authUser)

    return (
      <ReactRelayContext.Provider value={{ environment, variables }}>
        <ComposedComponent {...otherProps} authUser={authUser} />
      </ReactRelayContext.Provider>
    )
  }

  WithDataComp.getInitialProps = async ctx => {
    // Get the user and user token. If the user is needed, this should be
    // set in a higher component.
    const authUserFromSession = get(ctx, 'tabCustomData.authUser', null)
    const authUserToken = get(ctx, 'tabCustomData.authUserToken', null)

    // Evaluate the composed component's getInitialProps()
    let composedInitialProps = {}
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    // Get the Relay query and variables config. We pass the authUser
    // so the child component can use the user ID in the query, if needed.
    const { query, variables = {} } = getRelayQuery(authUserFromSession)

    let queryProps = {}
    let queryRecords = {}
    const environment = initEnvironment()

    if (query) {
      // TODO: Consider RelayQueryResponseCache
      // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
      queryProps = await fetchQuery(environment, query, variables, {
        token: authUserToken,
      })
      queryRecords = environment
        .getStore()
        .getSource()
        .toJSON()
    }

    return {
      ...composedInitialProps,
      ...queryProps,
      queryRecords,
      authUser: authUserFromSession,
    }
  }

  WithDataComp.displayName = `WithData(${ComposedComponent.displayName})`

  WithDataComp.propTypes = {
    authUser: PropTypes.shape({
      // TODO: define more properties
      uid: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }),
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
  }

  WithDataComp.defaultProps = {
    authUser: null,
  }

  return WithDataComp
}

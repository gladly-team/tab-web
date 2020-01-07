/* eslint react/jsx-props-no-spreading: 0 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from './createRelayEnvironment'
import { useAuthUser } from '../utils/auth/hooks'

// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

export default (ComposedComponent, getRelayQuery) => {
  const WithDataComp = props => {
    const { queryRecords, ...otherProps } = props
    const [environment] = useState(
      initEnvironment({
        records: queryRecords,
      })
    )

    // Get the AuthUser from context.
    const authUser = useAuthUser()

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
    // Get the AuthUser and user token. This is set in _app.js.
    const authUserFromSession = get(ctx, 'tabCustomData.authUser', null)
    const authUserToken = get(ctx, 'tabCustomData.authUserToken', null)

    // Evaluate the composed component's getInitialProps().
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
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
  }

  WithDataComp.defaultProps = {
    authUser: null,
  }

  return WithDataComp
}

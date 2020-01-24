/* eslint react/jsx-props-no-spreading: 0 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from '../createRelayEnvironment'
import { useAuthUserInfo } from '../auth/hooks'

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
    const { AuthUser } = useAuthUserInfo()

    // Get the Relay query and variables config. We pass the authUser
    // so the child component can use the user ID in the query, if needed.
    const { variables = {} } = getRelayQuery(AuthUser)

    return (
      <ReactRelayContext.Provider value={{ environment, variables }}>
        <ComposedComponent {...otherProps} />
      </ReactRelayContext.Provider>
    )
  }

  WithDataComp.getInitialProps = async ctx => {
    // Get the AuthUserInfo object. This is set in _app.js.
    const AuthUserInfo = get(ctx, 'tabCustomData.AuthUserInfo', null)
    const AuthUserFromSession = get(AuthUserInfo, 'AuthUser', null)
    const AuthUserToken = get(AuthUserInfo, 'token', null)

    // Evaluate the composed component's getInitialProps().
    let composedInitialProps = {}
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    // Get the Relay query and variables config. We pass the authUser
    // so the child component can use the user ID in the query, if needed.
    const { query, variables = {} } = getRelayQuery(AuthUserFromSession)

    let queryProps = {}
    let queryRecords = {}
    const environment = initEnvironment()

    if (query) {
      // TODO: Consider RelayQueryResponseCache
      // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
      queryProps = await fetchQuery(environment, query, variables, {
        token: AuthUserToken,
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
    }
  }

  WithDataComp.displayName = `WithData(${ComposedComponent.displayName})`

  WithDataComp.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
  }

  WithDataComp.defaultProps = {}

  return WithDataComp
}

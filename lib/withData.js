/* eslint react/jsx-props-no-spreading: 0 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from './createRelayEnvironment'

// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

// TODO: we likely want to break out `withUser` logic into its own
//   hook or HOC and handle redirection to sign-in. Then, each page
//   can set its own "userId" Relay variable.
export default (ComposedComponent, { query, variables = {} }) => {
  const WithDataComp = props => {
    const { authUser, queryRecords, ...otherProps } = props
    const [environment] = useState(
      initEnvironment({
        records: queryRecords,
      })
    )
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

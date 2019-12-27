/* eslint react/jsx-props-no-spreading: 0 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from './createRelayEnvironment'
import { useAuth } from '../utils/auth/hooks'

// Adapted from:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

export default (ComposedComponent, options = {}) => {
  const WithDataComp = props => {
    const { authUserFromSession, ...otherProps } = props
    const { queryRecords } = otherProps
    const [environment] = useState(
      initEnvironment({
        records: queryRecords,
      })
    )

    // We'll use the authed user from client-side auth (Firebase JS SDK)
    // when available. On the server side, we'll use the authed user from
    // the session. This allows us to server-render while also using Firebase's
    // client-side auth functionality.
    // Note: we need to destroy the session when logging out with the Firebase
    // JS SDK.
    const { user: authUserFromClient } = useAuth()
    const authUser = authUserFromClient || authUserFromSession || null

    console.log('withData session authUser', authUserFromSession)
    console.log('withData client authUser', authUserFromClient)
    console.log('withData FINAL authUser', authUser)

    return (
      <ReactRelayContext.Provider value={{ environment, variables: {} }}>
        <ComposedComponent {...otherProps} authUser={authUser} />
      </ReactRelayContext.Provider>
    )
  }

  WithDataComp.getInitialProps = async ctx => {
    const { req } = ctx

    // Get the user from the session.
    const authUserFromSession = get(req, 'session.decodedToken', null)

    // TODO: use this in GraphQL request.
    // const authUserToken = get(req, 'session.token', null)

    // Evaluate the composed component's getInitialProps()
    let composedInitialProps = {}
    if (ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    let queryProps = {}
    let queryRecords = {}
    const environment = initEnvironment()

    if (options.query) {
      // Provide the `url` prop data in case a graphql query uses it
      // const url = { query: ctx.query, pathname: ctx.pathname }
      const variables = {}
      // TODO: Consider RelayQueryResponseCache
      // https://github.com/facebook/relay/issues/1687#issuecomment-302931855
      queryProps = await fetchQuery(environment, options.query, variables)
      queryRecords = environment
        .getStore()
        .getSource()
        .toJSON()
    }

    return {
      ...composedInitialProps,
      ...queryProps,
      queryRecords,
      authUserFromSession,
    }
  }

  WithDataComp.displayName = `WithData(${ComposedComponent.displayName})`

  WithDataComp.propTypes = {
    authUserFromSession: PropTypes.shape({
      // TODO: define more properties
      email: PropTypes.string,
    }),
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
  }

  WithDataComp.defaultProps = {
    authUserFromSession: null,
  }

  return WithDataComp
}

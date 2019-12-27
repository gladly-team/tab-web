/* eslint react/jsx-props-no-spreading: 0 */

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from './createRelayEnvironment'

// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

export default (ComposedComponent, options = {}) => {
  const WithDataComp = props => {
    const { queryRecords } = props
    const [environment] = useState(
      initEnvironment({
        records: queryRecords,
      })
    )
    return (
      <ReactRelayContext.Provider value={{ environment, variables: {} }}>
        <ComposedComponent {...props} />
      </ReactRelayContext.Provider>
    )
  }

  WithDataComp.getInitialProps = async ctx => {
    const { req } = ctx

    // Get the user.
    const authUser = get(req, 'session.decodedToken', null)

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
      authUser,
    }
  }

  WithDataComp.displayName = `WithData(${ComposedComponent.displayName})`

  WithDataComp.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
  }

  return WithDataComp
}

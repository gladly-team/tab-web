/* eslint react/jsx-props-no-spreading: 0 */
import { get } from 'lodash/object'

// From:
// https://github.com/zeit/next.js/blob/canary/examples/with-relay-modern/lib/withData.js

import React from 'react'
import PropTypes from 'prop-types'
import { fetchQuery, ReactRelayContext } from 'react-relay'
import initEnvironment from './createRelayEnvironment'

export default (ComposedComponent, options = {}) => {
  const WithDataComp = class WithData extends React.Component {
    static async getInitialProps(ctx) {
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

    constructor(props) {
      super(props)
      this.environment = initEnvironment({
        records: props.queryRecords,
      })
    }

    render() {
      return (
        <ReactRelayContext.Provider
          value={{ environment: this.environment, variables: {} }}
        >
          <ComposedComponent {...this.props} />
        </ReactRelayContext.Provider>
      )
    }
  }

  WithDataComp.displayName = `WithData(${ComposedComponent.displayName})`

  WithDataComp.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    queryRecords: PropTypes.object.isRequired,
  }

  return WithDataComp
}

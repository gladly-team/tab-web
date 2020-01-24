import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import { graphql } from 'react-relay'
import withData from '../utils/pageWrappers/withData'
import Link from '../components/Link'
import { authURL, dashboardURL } from '../utils/urls'

const Example = props => {
  const { AuthUserInfo, app } = props
  const AuthUser = get(AuthUserInfo, 'AuthUser', null)
  const { moneyRaised } = app

  return (
    <div>
      <p>
        This page does not call withAuthUserInfo, so it will not know if you're
        signed in.
      </p>
      <Link to={dashboardURL}>
        <a>Home</a>
      </Link>
      {!AuthUser ? (
        <p>
          You are not signed in.{' '}
          <Link to={authURL}>
            <a>Sign in</a>
          </Link>
        </p>
      ) : (
        <p>You're signed in. Email: {AuthUser.email}</p>
      )}
      <div>
        <div>Money raised: {moneyRaised}</div>
      </div>
    </div>
  )
}

Example.displayName = 'Example'

Example.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
  }),
}

Example.defaultProps = {
  AuthUserInfo: null,
}

export default withData(Example, () => ({
  query: graphql`
    query exampleQuery {
      app {
        moneyRaised
      }
    }
  `,
}))

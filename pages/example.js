import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import Link from '../components/Link'
import { AuthUserInfoContext } from '../utils/auth/hooks'

const Example = props => {
  const { AuthUser, app } = props
  const { moneyRaised } = app

  return (
    <AuthUserInfoContext.Consumer>
      {AuthUserInfo => {
        // TODO: create HOC
        console.log('AuthUserInfo value:', AuthUserInfo)
        return (
          <div>
            <p>This page does not require user auth.</p>
            <Link to="/">
              <a>Home</a>
            </Link>
            {!AuthUser ? (
              <p>
                You are not signed in.{' '}
                <Link to="/auth">
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
      }}
    </AuthUserInfoContext.Consumer>
  )
}

Example.displayName = 'Example'

Example.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
  AuthUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    emailVerified: PropTypes.bool.isRequired,
  }),
}

Example.defaultProps = {
  AuthUser: null,
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

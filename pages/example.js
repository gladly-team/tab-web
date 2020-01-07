import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import Link from '../components/Link'
import { UserContext } from '../utils/auth/hooks'

const Example = props => {
  const { authUser, app } = props
  const { moneyRaised } = app

  return (
    <UserContext.Consumer>
      {value => {
        // TODO: create HOC
        console.log('AuthUser value:', value)
        return (
          <div>
            <p>This page does not require user auth.</p>
            <Link to="/">
              <a>Home</a>
            </Link>
            {!authUser ? (
              <p>
                You are not signed in.{' '}
                <Link to="/auth">
                  <a>Sign in</a>
                </Link>
              </p>
            ) : (
              <p>You're signed in. Email: {authUser.email}</p>
            )}
            <div>
              <div>Money raised: {moneyRaised}</div>
            </div>
          </div>
        )
      }}
    </UserContext.Consumer>
  )
}

Example.displayName = 'Example'

Example.propTypes = {
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
  authUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }),
}

Example.defaultProps = {
  authUser: null,
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

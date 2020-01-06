import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import withUser from '../lib/withUser'
import Link from '../components/Link'

const Example = props => {
  const { authUser, app } = props
  const { moneyRaised } = app

  return (
    <div>
      <p>
        This page is an example of using withUser with a component child (not a
        render prop).
      </p>
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
}

Example.propTypes = {
  authUser: PropTypes.shape({
    email: PropTypes.string,
  }),
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
}

Example.defaultProps = {
  authUser: null,
}

export default withUser(
  withData(Example, {
    query: graphql`
      query exampleQuery {
        app {
          moneyRaised
        }
      }
    `,
  })
)

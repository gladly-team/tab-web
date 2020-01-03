import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from '../lib/withData'
import Link from '../components/Link'

const Index = props => {
  const { authUser, app } = props
  const { moneyRaised } = app

  return (
    <div>
      <p>Hi there!</p>
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

Index.propTypes = {
  authUser: PropTypes.shape({
    email: PropTypes.string,
  }),
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
}

Index.defaultProps = {
  authUser: null,
}

export default withData(Index, {
  // The withData HOC adds the userId variable.
  query: graphql`
    query pagesIndexQuery {
      app {
        moneyRaised
      }
    }
  `,
})

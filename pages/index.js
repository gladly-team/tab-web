import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import { get } from 'lodash/object'
import withData from '../lib/withData'
import withUser from '../lib/withUser'
import Link from '../components/Link'

const Index = props => {
  const { authUser, app, user } = props
  const { moneyRaised } = app
  const { tabs, vcCurrent } = user

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
        <Link to="/example">
          <a>Another example page</a>
        </Link>
      </div>
      <div>
        <div>Money raised: {moneyRaised}</div>
        <div>Tabs: {tabs}</div>
        <div>Hearts: {vcCurrent}</div>
      </div>
    </div>
  )
}

Index.displayName = 'Index'

Index.propTypes = {
  authUser: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }),
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    tabs: PropTypes.number.isRequired,
    vcCurrent: PropTypes.number.isRequired,
  }).isRequired,
}

Index.defaultProps = {
  authUser: null,
}

export default withUser(
  withData(Index, authUser => {
    const userId = get(authUser, 'id')
    return {
      query: graphql`
        query pagesIndexQuery($userId: String!) {
          app {
            moneyRaised
          }
          user(userId: $userId) {
            tabs
            vcCurrent
          }
        }
      `,
      variables: {
        userId,
      },
    }
  })
)

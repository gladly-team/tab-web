import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import { get } from 'lodash/object'
import withAuthUserInfo from '../lib/withAuthUserInfo'
import withData from '../lib/withData'
import Link from '../components/Link'

const Index = props => {
  const { AuthUserInfo, app, user } = props
  const AuthUser = get(AuthUserInfo, 'AuthUser', null)
  const { moneyRaised } = app
  const { tabs, vcCurrent } = user

  return (
    <div>
      <p>Hi there!</p>
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
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
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
  AuthUserInfo: null,
}

export default withData(withAuthUserInfo(Index), authUser => {
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

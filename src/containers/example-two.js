import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import { get } from 'lodash/object'
import withAuthAndData from 'src/utils/pageWrappers/withAuthAndData'
import Link from 'src/components/Link'
import { authURL, betaOptInURL, exampleURL } from 'src/utils/urls'
import logout from 'src/utils/auth/logout'

const ExampleTwo = props => {
  const { AuthUserInfo, app, user } = props
  const AuthUser = get(AuthUserInfo, 'AuthUser', null)
  const { moneyRaised } = app
  const { tabs, vcCurrent } = user
  const onLogout = async () => {
    try {
      await logout()
    } catch (e) {
      // TODO: log error
      console.error(e) // eslint-disable-line no-console
    }
  }

  return (
    <div>
      <p>Hi there!</p>
      {!AuthUser ? (
        <div>
          <p>
            You are not signed in. <Link to={authURL}>Sign in</Link>
          </p>
        </div>
      ) : (
        <div>
          <p>You're signed in. Email: {AuthUser.email}</p>
          <button type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <Link to={exampleURL}>Another example page</Link>
      </div>
      <div style={{ marginTop: 20 }}>
        <div>Money raised: {moneyRaised}</div>
        <div>Tabs: {tabs}</div>
        <div>Hearts: {vcCurrent}</div>
      </div>
      <div style={{ marginTop: 20 }}>
        <p>
          <a href={betaOptInURL}>Change beta opt in</a>
        </p>
      </div>
    </div>
  )
}

ExampleTwo.displayName = 'ExampleTwo'

ExampleTwo.propTypes = {
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string.isRequired,
    isClientInitialized: PropTypes.bool.isRequired,
  }),
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    tabs: PropTypes.number.isRequired,
    vcCurrent: PropTypes.number.isRequired,
  }).isRequired,
}

ExampleTwo.defaultProps = {
  AuthUserInfo: null,
}

export default withAuthAndData(({ AuthUser }) => {
  const userId = get(AuthUser, 'id')
  return {
    query: graphql`
      query exampleTwoQuery($userId: String!) {
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
})(ExampleTwo)

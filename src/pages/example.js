import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import withData from 'src/utils/pageWrappers/withData'
import Link from 'src/components/Link'
import { dashboardURL } from 'src/utils/urls'

const Example = props => {
  // The AuthUserInfo prop, if we used it, would always be null regardless
  // of the user authentication state because we do not call the
  // withAuthUserInfo higher-order component on this page.
  const { app } = props
  const { moneyRaised } = app

  return (
    <div>
      <p>
        This page does not require authentication or include the authed user
        info, so it will not know if you're signed in and will not redirect to
        auth.
      </p>
      <Link to={dashboardURL}>
        <a>Home</a>
      </Link>
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
}

Example.defaultProps = {}

export default withData(() => ({
  query: graphql`
    query exampleQuery {
      app {
        moneyRaised
      }
    }
  `,
}))(Example)

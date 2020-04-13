import React from 'react'
import PropTypes from 'prop-types'
import { unregister } from 'next-offline/runtime'
import fetch from 'isomorphic-unfetch'
import { graphql } from 'react-relay'
import withData from 'src/utils/pageWrappers/withData'
import Link from 'src/components/Link'
import { apiBetaOptIn, dashboardURL } from 'src/utils/urls'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'

const Example = props => {
  // The AuthUserInfo prop, if we used it, would always be null regardless
  // of the user authentication state because we do not call the
  // withAuthUserInfo higher-order component on this page.
  const { app } = props
  const { moneyRaised } = app

  const setOptIn = async isOptedIn => {
    const response = await fetch(apiBetaOptIn, {
      method: 'POST',
      // eslint-disable-next-line no-undef
      headers: new Headers({
        // This custom header provides modest CSRF protection. See:
        // https://github.com/gladly-team/tab-web#authentication-approach
        'X-Gladly-Requested-By': 'tab-web-nextjs',
        'Content-Type': 'application/json',
      }),
      credentials: 'include',
      body: JSON.stringify({ optIn: isOptedIn }),
    })

    if (response.ok && !isOptedIn) {
      // If reverting back to the legacy app, remove cached content
      // and unregister the service worker.
      await clearAllServiceWorkerCaches()
      unregister('/newtab/service-worker.js')
    }
  }

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
      <div style={{ marginTop: 60 }}>
        <p>
          You can opt in or out to changing the /newtab/ page to go to this app:
        </p>
        <button onClick={() => setOptIn(true)} type="button">
          Opt in
        </button>
        <button onClick={() => setOptIn(false)} type="button">
          Opt out
        </button>
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

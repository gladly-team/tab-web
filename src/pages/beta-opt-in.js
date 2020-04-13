import React from 'react'
// import PropTypes from 'prop-types'
import { unregister } from 'next-offline/runtime'
import fetch from 'isomorphic-unfetch'
import Link from 'src/components/Link'
import { apiBetaOptIn, dashboardURL } from 'src/utils/urls'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'

const BetaOptIn = () => {
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
      unregister()
    }
  }

  return (
    <div>
      <Link to={dashboardURL}>
        <a>Home</a>
      </Link>
      <div style={{ margin: 60 }}>
        <p>Opt in or out to this beta app:</p>
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

BetaOptIn.displayName = 'BetaOptIn'
BetaOptIn.propTypes = {}
BetaOptIn.defaultProps = {}

export default BetaOptIn

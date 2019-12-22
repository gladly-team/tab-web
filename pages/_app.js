// Override the default Next.js app component.

/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../utils/auth/hooks'

const App = props => {
  const { Component, pageProps } = props
  const { initializing } = useAuth()

  // FIXME: we need to get the session on the server-side to
  // render HTML. Right now, the SSR only returns this "loading"
  // message. Or, remove this to render the app with a null user.
  if (initializing) {
    return <div>Loading...</div>
  }

  return <Component {...pageProps} />
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object.isRequired,
}

export default App

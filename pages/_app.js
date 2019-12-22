// Override the default Next.js app component.

/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../utils/auth/hooks'

const App = props => {
  const { Component, pageProps } = props
  const { initializing } = useAuth()

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

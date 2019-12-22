// Override the default Next.js app component.

/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { UserContext, useAuth } from '../utils/auth/hooks'

const App = props => {
  const { Component, pageProps } = props
  const { initializing, user } = useAuth()

  if (initializing) {
    return <div>Loading...</div>
  }

  return (
    <UserContext.Provider value={{ user }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object.isRequired,
}

export default App

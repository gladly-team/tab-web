/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import {
  UserContext,
  // useAuth
} from '../utils/auth/hooks'

const App = props => {
  const { Component, pageProps } = props
  // const { user } = useAuth()

  return (
    // <UserContext.Provider value={{ user }}>
    <UserContext.Provider value="foo!">
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  return { pageProps }
}

App.propTypes = {
  Component: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  pageProps: PropTypes.object.isRequired,
}

export default App

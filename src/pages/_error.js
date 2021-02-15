// https://nextjs.org/docs/advanced-features/custom-error-page#customizing-the-error-page
import React from 'react'
import PropTypes from 'prop-types'
import ErrorPage from 'src/components/ErrorPage'

const MyError = () => <ErrorPage />

MyError.getInitialProps = ({ res, err }) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

MyError.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types, react/no-unused-prop-types
  err: PropTypes.object,
}
MyError.defaultProps = {
  err: undefined,
}

export default MyError

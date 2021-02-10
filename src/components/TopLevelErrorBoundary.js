import React from 'react'
import logger from 'src/utils/logger'
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo, 'what')
    // Catch errors in any components below and re-render with error message
    logger.error(error)
    this.setState({
      error,
      errorInfo,
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    const { errorInfo, error } = this.state
    const { children } = this.props
    if (errorInfo) {
      // Error path
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {error && error.toString()}
            <br />
            {errorInfo.componentStack}
          </details>
        </div>
      )
    }
    // Normally, just render children
    return children
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}
export default ErrorBoundary

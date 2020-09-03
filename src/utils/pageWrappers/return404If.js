/* eslint react/jsx-props-no-spreading: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import ErrorPage from 'next/error'

// If `should404` is true, return a 404 for the wrapped page.
const return404If = (should404) => (ComposedComponent) => {
  const Return404IfComp = ({ is404, composedInitialProps }) => {
    // https://nextjs.org/docs/advanced-features/custom-error-page#reusing-the-built-in-error-page
    if (is404) {
      return <ErrorPage statusCode={404} />
    }
    return <ComposedComponent {...composedInitialProps} />
  }

  Return404IfComp.getInitialProps = async (ctx) => {
    // Evaluate the composed component's getInitialProps().
    let composedInitialProps = {}
    if (!should404 && ComposedComponent.getInitialProps) {
      composedInitialProps = await ComposedComponent.getInitialProps(ctx)
    }

    // Set the response status code.
    if (should404 && ctx.res) {
      ctx.res.statusCode = 404
    }

    return {
      is404: should404,
      composedInitialProps,
    }
  }

  Return404IfComp.displayName = `Return404IfComp(${ComposedComponent.displayName})`
  Return404IfComp.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    composedInitialProps: PropTypes.object.isRequired,
    is404: PropTypes.bool.isRequired,
  }
  Return404IfComp.defaultProps = {}

  return Return404IfComp
}

export default return404If

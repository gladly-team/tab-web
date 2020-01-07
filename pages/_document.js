/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {
  render() {
    // https://github.com/zeit/next.js/issues/3043#issuecomment-334521241
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    const { authUserFromSession, authUserToken } = this.props
    const authInfo = {
      authUserFromSession,
      authUserToken,
    }
    return (
      <Html>
        <Head>
          <script
            id="__TAB_WEB_AUTH_INFO"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(authInfo, null, 2),
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  // Get the AuthUser and user token. This is set in _app.js.
  const authUserFromSession = get(ctx, 'tabCustomData.authUser', null)
  const authUserToken = get(ctx, 'tabCustomData.authUserToken', null)

  const initialProps = await Document.getInitialProps(ctx)
  return { ...initialProps, authUserFromSession, authUserToken }
}

CustomDocument.propTypes = {
  authUserFromSession: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    emailVerified: PropTypes.bool.isRequired,
  }),
  authUserToken: PropTypes.string,
}

export default CustomDocument

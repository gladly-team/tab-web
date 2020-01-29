/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { PWAManifestURL } from 'src/utils/urls'

class CustomDocument extends Document {
  render() {
    // Store initial props from request data that we need to use again on
    // the client. See:
    // https://github.com/zeit/next.js/issues/3043#issuecomment-334521241
    // https://github.com/zeit/next.js/issues/2252#issuecomment-353992669
    // Alternatively, we can use a store, like Redux.
    const { AuthUserInfo } = this.props
    return (
      <Html>
        <Head>
          <link rel="manifest" href={PWAManifestURL} />
          <script
            id="__TAB_WEB_AUTH_USER_INFO"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(AuthUserInfo, null, 2),
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
  // Get the AuthUserInfo object. This is set in _app.js.
  const AuthUserInfo = get(ctx, 'tabCustomData.AuthUserInfo', null)

  const initialProps = await Document.getInitialProps(ctx)
  return { ...initialProps, AuthUserInfo }
}

CustomDocument.propTypes = {
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
  }).isRequired,
}

export default CustomDocument

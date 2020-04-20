/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import { PWAManifestURL } from 'src/utils/urls'
import {
  NEXT_CTX_CUSTOM_DATA_KEY,
  NEXT_CTX_AUTH_USER_INFO_KEY,
} from 'src/utils/constants'
import theme from 'src/utils/theme'

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
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="apple-touch-icon"
            href="/static/img/logo/logo192-apple.png"
          />
          <script
            id="__TAB_WEB_AUTH_USER_INFO"
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(AuthUserInfo, null, 2),
            }}
          />
        </Head>
        <body style={{ margin: 0, padding: 0 }}>
          {/*
            Ads code. See:
            https://github.com/gladly-team/tab-ads#html-tags
           */}

          {/* Google Publisher Tag */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var googletag = window.googletag || {}
                googletag.cmd = googletag.cmd || []
                googletag.cmd.push(() => {
                  googletag.pubads().disableInitialLoad()
                  googletag.pubads().setTagForChildDirectedTreatment(0)
                })
                var gads = document.createElement('script')
                gads.async = true
                gads.type = 'text/javascript'
                var useSSL = document.location.protocol === 'https:'
                gads.src = (useSSL ? 'https:' : 'http:') +
                  '//www.googletagservices.com/tag/js/gpt.js'
                var head = document.getElementsByTagName('head')[0]
                head.appendChild(gads)
              `,
            }}
          />

          {/* Amazon apstag */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  !function(a9,a,p,s,t,A,g){if(a[a9])return;function q(c,r){a[a9]._Q.push([c,r])}a[a9]={init:function(){q("i",arguments)},fetchBids:function(){q("f",arguments)},setDisplayBids:function(){},targetingKeys:function(){return[]},_Q:[]};A=p.createElement(s);A.async=!0;A.src=t;g=p.getElementsByTagName(s)[0];g.parentNode.insertBefore(A,g)}("apstag",window,document,"script","//c.amazon-adsystem.com/aax2/apstag.js");
                } catch(e) {
                  console.error(e)
                }
                `,
            }}
          />

          {/* Index Exchange */}
          <script
            async
            src="//js-sec.indexww.com/ht/p/189508-208262485043658.js"
          />

          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  // Material UI:
  // Render app and page and get the context of the page with collected side effects.
  // https://github.com/mui-org/material-ui/tree/master/examples/nextjs
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/jsx-props-no-spreading
      enhanceApp: App => props => sheets.collect(<App {...props} />),
    })

  // Get the AuthUserInfo object. This is set in _app.js.
  const AuthUserInfo = get(
    ctx,
    [NEXT_CTX_CUSTOM_DATA_KEY, NEXT_CTX_AUTH_USER_INFO_KEY],
    null
  )

  const initialProps = await Document.getInitialProps(ctx)
  return {
    ...initialProps,
    AuthUserInfo, // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  }
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

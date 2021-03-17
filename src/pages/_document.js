/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import createEmotionServer from '@emotion/server/create-instance'
import { PWAManifestURL } from 'src/utils/urls'
import Logo192Apple from 'src/assets/logos/logo192-apple.png'
import TabCMPHeadElements from 'src/components/TabCMPHeadElements'
import theme from 'src/utils/theme'
import { cache } from './_app'

const { extractCritical } = createEmotionServer(cache)

class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href={PWAManifestURL} />
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link rel="apple-touch-icon" href={Logo192Apple} />
          <TabCMPHeadElements />
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

CustomDocument.getInitialProps = async (ctx) => {
  // Manage Material UI styles:
  // https://next.material-ui.com/guides/server-rendering/#material-ui-on-the-server
  // https://github.com/mui-org/material-ui/blob/next/examples/nextjs/pages/_document.js
  // Note as of v5 alpha, the CSS injection order is buggy:
  // https://github.com/mui-org/material-ui/issues/24109
  // And `makeStyles` will likely be deprecated:
  // https://github.com/mui-org/material-ui/issues/22342
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/jsx-props-no-spreading
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)
  const styles = extractCritical(initialProps.html)

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
      <style
        key="emotion-style-tag"
        data-emotion={`css ${styles.ids.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles.css }}
      />,
    ],
  }
}

CustomDocument.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.array.isRequired,
}

CustomDocument.defaultProps = {}

export default CustomDocument

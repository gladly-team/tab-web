/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import { PWAManifestURL } from 'src/utils/urls'
import theme from 'src/utils/theme'
import Logo192Apple from 'src/assets/logos/logo192-apple.png'
import TabCMPHeadElements from 'src/components/TabCMPHeadElements'

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

          {/* Google Analytics V4 Tag */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-LDFLQCKVHG"
          />
          <script
            key="gtag-global-ga4"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LDFLQCKVHG');
            gtag('config', 'G-LDFLQCKVHG',{'tfac_app_version':'v4'});
            `,
            }}
          />
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
          {/* Reddit Pixel */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','t2_9btvy');rdt('track', 'PageVisit');`,
            }}
          />
          {/* Facebook Pixel */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                  try {
                    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                      document,'script','https://connect.facebook.net/en_US/fbevents.js');
                      fbq('init', '1813501258922708');
                  } catch(e) {
                    console.error(e)
                  }`,
            }}
          />
          <noscript>
            <img
              alt=""
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=1813501258922708&ev=PageView&noscript=1"
            />
          </noscript>
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
  // Material UI:
  // Render app and page and get the context of the page with collected side effects.
  // https://github.com/mui-org/material-ui/tree/master/examples/nextjs
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/jsx-props-no-spreading
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await Document.getInitialProps(ctx)
  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  }
}

CustomDocument.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.array.isRequired,
}

CustomDocument.defaultProps = {}

export default CustomDocument

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
        <body style={{ margin: 0, padding: 0 }} className="v4">
          {/* Google Analytics V4 Tag */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-Z4JZQERBJY"
          />
          <script
            key="gtag-global-ga4"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z4JZQERBJY');
            gtag('config', 'G-Z4JZQERBJY',{'tfac_app_version':'v4'});
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
          <Main />
          <NextScript />

          {/* Begin: Quantcast Measure */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window._qevents = window._qevents || [];
                (function() {
                var elem = document.createElement('script');
                elem.src = (document.location.protocol == "https:" ? "https://secure" : "http://edge") + ".quantserve.com/quant.js";
                elem.async = true;
                elem.type = "text/javascript";
                var scpt = document.getElementsByTagName('script')[0];
                scpt.parentNode.insertBefore(elem, scpt);
                })();
                window._qevents.push({
                qacct:"p-FPBLJYpJgR9Zu",
                uid:"__INSERT_EMAIL_HERE__"
                });
              `,
            }}
          />
          <noscript>
            <div style={{ display: 'none' }}>
              <img
                src="//pixel.quantserve.com/pixel/p-FPBLJYpJgR9Zu.gif"
                border="0"
                height="1"
                width="1"
                alt=""
              />
            </div>
          </noscript>
          {/* End: Quantcast Measure */}
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

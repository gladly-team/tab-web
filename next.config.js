const withOffline = require('next-offline')
const withImages = require('next-images')

// Sentry error logging. See:
// https://github.com/vercel/next.js/blob/canary/examples/with-sentry-simple/next.config.js
// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map',
})

const basePath = process.env.NEXT_PUBLIC_URLS_BASE_PATH || ''
const url = process.env.VERCEL_URL || 'http://localhost:3001/'
const devAssetsRegex = 'https://prod-tab2017-media.gladly.io/.*'
const prodAssetsRegex = 'https://dev-tab2017-media.gladly.io/.*'
const devCloudFrontRegex = 'https://dev-tab2017.gladly.io/newtab/.*'
const prodCloudFrontRegex = 'https://tab.gladly.io/newtab/.*'

const cachingRegex = new RegExp(
  `${url}${basePath}.*|${devAssetsRegex}|${prodAssetsRegex}|${devCloudFrontRegex}|${prodCloudFrontRegex}`
)
// Use the SentryWebpack plugin to upload the source maps during build.
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const nextConfig = {
  // For routing, we need:
  // * the app to live on the /newtab base path.
  // * to enforce a trailing slash on pages. This ensures a functional
  //   service worker and matches the URL in the Tab browser extension.
  // * the /v4 path to rewrite to the /newtab path. This allows us to
  //   access the API from a different base path, which is important
  //   for routing through CloudFront with the legacy app.
  basePath,
  trailingSlash: true,

  async rewrites() {
    return [
      {
        // This includes the base path: /newtab/service-worker.js
        source: '/service-worker.js',
        destination: '/_next/static/service-worker.js',
      },
      // Keeping this logic in vercel.json for now. Next.js 9.5
      // requires an absolute destination URL when basePath is
      // false, which is more trouble than it's worth.
      // {
      //   source: '/v4/:route(.*)',
      //   destination: '/newtab/:route',
      //   basePath: false,
      // },
    ]
  },

  async redirects() {
    return [
      // Redirect from the index page to the base path index.
      // This is for convenience in local development and when
      // viewing preview deployments. It shouldn't need to be used
      // in production.
      basePath && {
        source: `/`,
        destination: `${basePath}/`,
        basePath: false,
        permanent: false,
      },
      {
        source: `/uninstalled/`,
        destination: 'https://forms.gle/2q33AzpTA3A6vvZo6',
        permanent: false,
      },
      {
        source: `/first-tab/`,
        destination: `/`,
        permanent: false,
      },
    ].filter(Boolean)
  },

  async headers() {
    return [
      {
        // This includes the base path: /newtab/service-worker.js
        source: '/service-worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
          {
            key: 'Service-Worker-Allowed',
            value: `${basePath}/`, // e.g., /newtab/
          },
        ],
      },
    ]
  },

  webpack: (config, options) => {
    // Sentry error logging. See:
    // https://github.com/vercel/next.js/blob/canary/examples/with-sentry-simple/next.config.js
    //
    // In `pages/_app.js`, Sentry is imported from @sentry/node. While
    // @sentry/browser will run in a Node.js environment, @sentry/node will use
    // Node.js-only APIs to catch even more unhandled exceptions.
    //
    // This works well when Next.js is SSRing your page on a server with
    // Node.js, but it is not what we want when your client-side bundle is being
    // executed by a browser.
    //
    // Luckily, Next.js will call this webpack function twice, once for the
    // server and once for the client. Read more:
    // https://nextjs.org/docs#customizing-webpack-config
    //
    // So ask Webpack to replace @sentry/node imports with @sentry/browser when
    // building the browser's bundle
    if (!options.isServer) {
      // eslint-disable-next-line no-param-reassign
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    // When all the Sentry configuration env variables are available/configured
    // The Sentry webpack plugin gets pushed to the webpack plugins to build
    // and upload the source maps to sentry.
    // This is an alternative to manually uploading the source maps
    // Note: This is disabled in development mode.
    if (
      process.env.NEXT_PUBLIC_SENTRY_DSN &&
      process.env.SENTRY_ORG &&
      process.env.SENTRY_PROJECT &&
      process.env.SENTRY_AUTH_TOKEN &&
      process.env.SENTRY_UPLOAD_SOURCE_MAPS_ON_BUILD === 'true'
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: '.next',
          ignore: ['node_modules'],
          urlPrefix: '~/_next',
          release: options.buildId,
        })
      )
    }

    return config
  },
  // Modify our service worker manifest.
  transformManifest: (manifest) => ['/'].concat(manifest), // add the homepage to the cache
  // Let us manually register the service worker.
  // https://github.com/hanford/next-offline#runtime-registration
  dontAutoRegisterSw: true,
  // Whether to enable the service worker in development. Note this may not work
  // if we don't have a custom _error.js file:
  // https://github.com/hanford/next-offline/issues/190#issuecomment-535278921
  generateInDevMode: false,
  // The base path from which to serve the service worker. This affects the
  // default scope.
  // https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope
  registerSwPrefix: '/newtab',
  // Limit the service worker to this app's base path.
  scope: '/newtab/',
  workboxOpts: {
    swDest: 'static/service-worker.js',
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    // Cache strategies for different resources:
    // https://developers.google.com/web/tools/workbox/modules/workbox-strategies#using_strategies
    runtimeCaching: [
      {
        // All resources except requests to /api/* or /graphql*, including
        // variants with our base path. Note that our base path, "/newtab", is
        // hardcoded here.
        // https://regex101.com/r/5cs6L7/1/tests
        // see caching strategies here https://developers.google.com/web/tools/workbox/modules/workbox-strategies
        urlPattern: cachingRegex,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'tab-resources',
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
            // Automatically clean up if quota is exceeded.
            purgeOnQuotaError: true,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      {
        // Requests to /api/* or /graphql*, including variants with our base
        // path. Note that our base path, "/newtab", is hardcoded here. With a
        // "network only" strategy, this should be the same as not defining
        // any caching at all, so we're just being explicit here.
        // https://regex101.com/r/2ttcQE/2
        urlPattern: /^http[s]?:\/\/(?:[^/\s]+\/)(?:(api\/|graphql(?:\/)?$|newtab\/api\/|newtab\/graphql(?:\/)?$))/,
        handler: 'NetworkOnly',
      },
    ],
  },
  // Automatically inline all images under this size.
  inlineImageLimit: 16384,
}

module.exports = withSourceMaps(withOffline(withImages(nextConfig)))

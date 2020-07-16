const path = require('path')
const withOffline = require('next-offline')
const withImages = require('next-images')

// Sentry error logging. See:
// https://github.com/vercel/next.js/blob/canary/examples/with-sentry-simple/next.config.js
// Use the hidden-source-map option when you don't want the source maps to be
// publicly available on the servers, only to the error reporting
const withSourceMaps = require('@zeit/next-source-maps')({
  devtool: 'hidden-source-map'
})

// Use the SentryWebpack plugin to upload the source maps during build.
const SentryWebpackPlugin = require('@sentry/webpack-plugin')

// Only use the .env file for local development.
if (process.env.USE_LOCAL_ENV_FILE === 'true') {
  // eslint-disable-next-line no-console
  console.log('Loading the local .env file.')
  require('./src/env')
} else {
  // eslint-disable-next-line no-console
  console.log('Ignoring the local .env file. Set env var "USE_LOCAL_ENV_FILE" to "true" if you want to use it.')
}

const nextConfig = {
  basePath: process.env.URLS_BASE_PATH,
  exportTrailingSlash: true,
  // experimental: {
  //   // https://github.com/vercel/next.js/issues/5214
  //   // https://github.com/vercel/next.js/pull/13333
  //   ...(process.env.URLS_USE_TRAILING_SLASH === 'true' && { trailingSlash: true })
  // },
  async redirects() {
    return [
      // For convenience in local development.
      {
        source: `/`,
        destination: `${process.env.URLS_BASE_PATH}`,
        basePath: false,
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/service-worker.js',
        destination: '/_next/static/service-worker.js'
      },
      // To support a /v4/ API base path.
      {
        source: `${process.env.URLS_API_BASE_PATH}/:path*`,
        destination: `${process.env.URLS_BASE_PATH}/:path*`,
        basePath: false,
       }
    ]
  },
  // Public, build-time env vars.
  // https://nextjs.org/docs#build-time-configuration
  env: {
    ADS_ENABLED: process.env.ADS_ENABLED,
    ADS_USE_MOCK_ADS: process.env.ADS_USE_MOCK_ADS,
    FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES: process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES,
    FEATURE_FLAG_MOCK_ACHIEVEMENTS: process.env.FEATURE_FLAG_MOCK_ACHIEVEMENTS,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
    GRAPHQL_SCHEMA_LOCATION: process.env.GRAPHQL_SCHEMA_LOCATION,
    RELAY_ENDPOINT: process.env.RELAY_ENDPOINT,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SERVICE_WORKER_ENABLED: process.env.SERVICE_WORKER_ENABLED,
    URLS_API_BASE_PATH: process.env.URLS_API_BASE_PATH,
    URLS_BASE_PATH: process.env.URLS_BASE_PATH,
    URLS_USE_TRAILING_SLASH: process.env.URLS_USE_TRAILING_SLASH,
  },
  webpack: (config, options) => {
    // Use absolute imports from 'src/'. See:
    // https://github.com/zeit/next.js/blob/canary/examples/with-absolute-imports/next.config.js#L8
    // We use eslint-import-resolver-alias in eslintrc.json to handle linting.
    // https://github.com/benmosher/eslint-plugin-import/issues/1286
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias.src = path.join(__dirname, 'src')

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
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    // When all the Sentry configuration env variables are available/configured
    // The Sentry webpack plugin gets pushed to the webpack plugins to build
    // and upload the source maps to sentry.
    // This is an alternative to manually uploading the source maps
    // Note: This is disabled in development mode.
    if (
      process.env.SENTRY_DSN &&
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
        urlPattern: /^http[s]?:\/\/(?:[^/\s]+\/)(?:(?!api\/|graphql(?:\/)?$|newtab\/api\/|newtab\/graphql(?:\/)?$)).*$/,
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
}

module.exports = withSourceMaps(withOffline(withImages(nextConfig)))

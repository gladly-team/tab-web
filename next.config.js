const path = require('path')
const withOffline = require('next-offline')

require('./src/env')

const nextConfig = {
  exportTrailingSlash: true,
  // Public, build-time env vars.
  // https://nextjs.org/docs#build-time-configuration
  env: {
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
    GRAPHQL_SCHEMA_LOCATION: process.env.GRAPHQL_SCHEMA_LOCATION,
    RELAY_ENDPOINT: process.env.RELAY_ENDPOINT,
    URLS_BASE_PATH: process.env.URLS_BASE_PATH, // @area/workaround/next-js-base-path
    URLS_USE_TRAILING_SLASH: process.env.URLS_USE_TRAILING_SLASH,
  },
  webpack(config) {
    // Use absolute imports from 'src/'. See:
    // https://github.com/zeit/next.js/blob/canary/examples/with-absolute-imports/next.config.js#L8
    // We use eslint-import-resolver-alias in eslintrc.json to handle linting.
    // https://github.com/benmosher/eslint-plugin-import/issues/1286
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias.src = path.join(__dirname, 'src')
    return config
  },
  // Modify our service worker manifest.
  transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
  // Whether to enable the service worker in development. Note this may not work
  // if we don't have a custom _error.js file:
  // https://github.com/hanford/next-offline/issues/190#issuecomment-535278921
  generateInDevMode: false,
  // The base path from which to serve the service worker. This affects the
  // default scope.
  // https://developers.google.com/web/ilt/pwa/introduction-to-service-worker#registration_and_scope
  registerSwPrefix: '/v4',
  // Limit the service worker to this app's base path.
  scope: '/v4/',
  workboxOpts: {
    swDest: 'static/service-worker.js',
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    // TODO:
    // Configure different strategies:
    // https://github.com/hanford/next-offline#cache-strategies
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'https-calls',
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
            // Automatically cleanup if quota is exceeded.
            purgeOnQuotaError: true,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
}

module.exports = withOffline(nextConfig)

const path = require('path')
const withOffline = require('next-offline')

require('./src/env')

const nextConfig = {
  exportTrailingSlash: true,
  // Public, build-time env vars.
  // https://nextjs.org/docs#build-time-configuration
  env: {
    ADS_ENABLED: process.env.ADS_ENABLED,
    ADS_USE_MOCK_ADS: process.env.ADS_USE_MOCK_ADS,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
    GRAPHQL_SCHEMA_LOCATION: process.env.GRAPHQL_SCHEMA_LOCATION,
    RELAY_ENDPOINT: process.env.RELAY_ENDPOINT,
    SERVICE_WORKER_ENABLED: process.env.SERVICE_WORKER_ENABLED,
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

module.exports = withOffline(nextConfig)

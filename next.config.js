require('./env.js')

module.exports = {
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
  // FIXME
  // https://github.com/benmosher/eslint-plugin-import/issues/1286
  webpack(config) {
    // Use absolute imports from 'src/'. See:
    // https://github.com/zeit/next.js/blob/canary/examples/with-absolute-imports/next.config.js#L8
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias.src = __dirname
    return config
  },
}

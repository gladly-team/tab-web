require('./env.js')

module.exports = {
  // Public, build-time env vars.
  // https://nextjs.org/docs#build-time-configuration
  env: {
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
    GRAPHQL_SCHEMA_LOCATION: process.env.GRAPHQL_SCHEMA_LOCATION,
    RELAY_ENDPOINT: process.env.RELAY_ENDPOINT,
  },
}

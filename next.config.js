require('./env.js')

module.exports = {
  // https://nextjs.org/docs#build-time-configuration
  env: {
    FIREBASE_PUBLIC_API_KEY: process.env.FIREBASE_PUBLIC_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    GRAPHQL_SCHEMA_LOCATION: process.env.RELAY_ENDPOINT,
    RELAY_ENDPOINT: process.env.RELAY_ENDPOINT,
  },
}

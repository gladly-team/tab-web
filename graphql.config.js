require('./env.js')

module.exports = {
  projects: {
    default: {
      schema: process.env.RELAY_ENDPOINT,
      extensions: {
        codegen: {
          './schema/schema.graphql': ['schema-ast'],
        },
      },
    },
  },
}

require('./env.js')

module.exports = {
  projects: {
    default: {
      schema: process.env.GRAPHQL_SCHEMA_LOCATION,
      extensions: {
        codegen: {
          './schema/schema.graphql': ['schema-ast'],
        },
      },
    },
  },
}

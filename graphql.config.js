require('./src/env')

module.exports = {
  projects: {
    default: {
      schema: process.env.GRAPHQL_SCHEMA_LOCATION,
      extensions: {
        codegen: {
          './src/schema/schema.graphql': ['schema-ast'],
        },
      },
    },
  },
}

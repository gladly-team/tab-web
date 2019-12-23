const fs = require('fs')

const { NODE_ENV } = process.env
if (!NODE_ENV) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified.'
  )
}

// Set env vars from appropiate `.env` files. See:
// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotEnvPath = './.env'
const dotEnvFiles = [
  `${dotEnvPath}.${NODE_ENV}.local`,
  `${dotEnvPath}.${NODE_ENV}`,
  // Don't include `.env.local` for the test environment.
  NODE_ENV !== 'test' && `${dotEnvPath}.local`,
  dotEnvPath,
].filter(Boolean)

dotEnvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    // eslint-disable-next-line global-require
    require('dotenv').config({
      path: dotenvFile,
    })
  }
})

module.exports = {
  env: {
    TEST_VAR: process.env.TEST_VAR,
  },
}

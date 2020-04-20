// Mocks every media file to return its filename. From:
// https://jestjs.io/docs/en/webpack.html#mocking-css-modules
// Related issue comment:
// https://github.com/facebook/jest/issues/2838#issuecomment-291525128
// This is an alternative to using Jest's moduleNameMapper with
// a hardcoded file stub value.

const path = require('path')

module.exports = {
  process(src, filename) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`
  },
}

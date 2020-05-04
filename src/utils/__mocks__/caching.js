/* eslint-env jest */

const mock = jest.genMockFromModule('src/utils/caching')

mock.clearAllServiceWorkerCaches = jest.fn(() => Promise.resolve())

module.exports = mock

const mock = jest.createMockFromModule('../caching')

mock.clearAllServiceWorkerCaches = jest.fn(() => Promise.resolve())

module.exports = mock

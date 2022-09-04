const mockDetectBrowser = jest.createMockFromModule('detect-browser')

mockDetectBrowser.detect = jest.fn(() => ({
  name: 'chrome',
  os: 'Mac OS',
  type: 'browser',
  version: '58.0.3029',
}))

module.exports = mockDetectBrowser

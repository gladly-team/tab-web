/* eslint-env jest */

// TODO: Consider deleting this. We might instead use:
//   https://github.com/Xunnamius/next-test-api-route-handler/tree/main/docs

/**
 * Create a mock HTTP response object for testing. It is an
 * incomplete set of values.
 * @return {Object}
 */
const getMockRes = () => {
  const mockRes = {
    output: {},
    outputEncodings: {},
    outputCallbacks: {},
    outputSize: 123,
    writable: true,
    chunkedEncoding: false,
    shouldKeepAlive: true,
    useChunkedEncodingByDefault: true,
    sendDate: true,
    finished: false,
    socket: {},
    connection: {},
    statusCode: 200,
    locals: {},
    flush: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
    writeHead: jest.fn(),
  }
  mockRes.json = jest.fn(() => mockRes)
  mockRes.status = jest.fn(() => mockRes)
  return mockRes
}

export default getMockRes

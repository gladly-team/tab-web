import getMockReq from 'src/utils/testHelpers/mockReq'
import getMockRes from 'src/utils/testHelpers/mockRes'
import { CUSTOM_HEADER_NAME } from 'src/utils/middleware/constants'

jest.mock('src/utils/logger')

afterEach(() => {
  jest.clearAllMocks()
})

describe('customHeaderRequired middleware', () => {
  it('calls the handler when successful', async () => {
    expect.assertions(1)
    const mockReq = {
      ...getMockReq(),
      headers: {
        ...getMockReq().headers,
        [CUSTOM_HEADER_NAME.toLowerCase()]: 'tabV4',
      },
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const customHeaderRequired =
      require('src/utils/middleware/customHeaderRequired').default
    await customHeaderRequired(mockHandler)(mockReq, mockRes)
    expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes)
  })

  it('returns a 400 error if the `CUSTOM_HEADER_NAME` header is not set', async () => {
    expect.assertions(2)
    const mockReq = {
      ...getMockReq(),
    }
    const mockRes = getMockRes()
    const mockHandler = jest.fn()
    const customHeaderRequired =
      require('src/utils/middleware/customHeaderRequired').default
    await customHeaderRequired(mockHandler)(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid "X-Gladly-Requested-By" header value.',
    })
  })
})

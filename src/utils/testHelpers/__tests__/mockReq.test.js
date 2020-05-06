import getMockReq from 'src/utils/testHelpers/mockReq'

describe('mockReq', () => {
  it('returns an object', () => {
    expect.assertions(1)
    expect(getMockReq()).toEqual(expect.any(Object))
  })
})

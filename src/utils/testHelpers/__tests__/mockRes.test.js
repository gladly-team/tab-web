import getMockRes from 'src/utils/testHelpers/mockRes'

describe('mockReq', () => {
  it('returns an object', () => {
    expect.assertions(1)
    expect(getMockRes()).toEqual(expect.any(Object))
  })
})

import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'

describe('getMockNextJSContext', () => {
  it('returns expected shape by default', () => {
    expect.assertions(1)
    expect(getMockNextJSContext()).toStrictEqual({
      pathname: expect.any(String),
      query: expect.any(Object),
      asPath: expect.any(String),
      err: undefined,
      req: expect.any(Object),
      res: expect.any(Object),
    })
  })

  it('returns expected shape when called with the "serverSide" === false option', () => {
    expect.assertions(1)
    expect(getMockNextJSContext({ serverSide: false })).toStrictEqual({
      pathname: expect.any(String),
      query: expect.any(Object),
      asPath: expect.any(String),
      err: undefined,
      // No req or res values.
    })
  })
})

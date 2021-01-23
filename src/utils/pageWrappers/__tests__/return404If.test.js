import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'

afterEach(() => {
  jest.clearAllMocks()
})

describe('return404If: render', () => {
  it('returns { notFound: true } if "should404" is true', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const getSSPFunc = return404If(true)()
    const mockCtx = getMockNextJSContext()
    const response = await getSSPFunc(mockCtx)
    expect(response).toEqual({
      notFound: true,
    })
  })

  it('returns empty props when "should404" is false and there is no composed getServerSideProps function', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const getSSPFunc = return404If(false)()
    const mockCtx = getMockNextJSContext()
    const response = await getSSPFunc(mockCtx)
    expect(response).toEqual({
      props: {},
    })
  })

  it('returns composed props when "should404" is false and there is a composed getServerSideProps function', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const mockGetSSPFunc = async () => ({
      some: 'props',
    })
    const getSSPFunc = return404If(false)(mockGetSSPFunc)
    const mockCtx = getMockNextJSContext()
    const response = await getSSPFunc(mockCtx)
    expect(response).toEqual({
      props: {
        some: 'props',
      },
    })
  })

  it('passes the context to the composed getServerSideProps function', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const mockGetSSPFunc = jest.fn()
    const getSSPFunc = return404If(false)(mockGetSSPFunc)
    const mockCtx = getMockNextJSContext()
    await getSSPFunc(mockCtx)
    expect(mockGetSSPFunc).toHaveBeenCalledWith(mockCtx)
  })
})

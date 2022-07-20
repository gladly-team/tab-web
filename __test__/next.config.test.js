jest.mock('next-offline', () => (config) => config)
jest.mock('next-images', () => (config) => config)
jest.mock('next-transpile-modules', () => () => (config) => config)
jest.mock('@sentry/webpack-plugin')
jest.mock('@zeit/next-source-maps', () => () => (config) => config)

afterEach(() => {
  jest.resetModules()
})

describe('Next.js config', () => {
  it('returns an object with some expected properties', () => {
    const config = require('../next.config')
    expect(config).toMatchObject({
      trailingSlash: true,
      redirects: expect.any(Function),
      rewrites: expect.any(Function),
      headers: expect.any(Function),
      webpack: expect.any(Function),
    })
  })
})

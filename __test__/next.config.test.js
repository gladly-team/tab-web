jest.mock('next-offline', () => (config) => config)
jest.mock('next-images', () => (config) => config)
jest.mock('next-transpile-modules', () => () => (config) => config)
jest.mock('@sentry/webpack-plugin')
jest.mock('@zeit/next-source-maps', () => () => (config) => config)

beforeEach(() => {
  process.env.NEXT_PUBLIC_VERCEL_URL = 'tab-abc123-gladly-team.vercel.app'
})

afterEach(() => {
  jest.resetModules()
})

describe('Next.js config', () => {
  it('returns an object with some expected properties', () => {
    expect.assertions(1)
    const config = require('../next.config')
    expect(config).toMatchObject({
      trailingSlash: true,
      redirects: expect.any(Function),
      rewrites: expect.any(Function),
      headers: expect.any(Function),
      webpack: expect.any(Function),
    })
  })

  it('sets the expected service worker caching regex', () => {
    expect.assertions(1)
    const config = require('../next.config')
    expect(config.workboxOpts.runtimeCaching[0].urlPattern).toEqual(
      /tab-abc123-gladly-team.vercel.app.*|https:\/\/prod-tab2017-media.gladly.io\/.*|https:\/\/dev-tab2017-media.gladly.io\/.*|https:\/\/dev-tab2017.gladly.io\/newtab\/.*|https:\/\/tab.gladly.io\/newtab\/.*/
    )
  })

  it('throws if the NEXT_PUBLIC_VERCEL_URL environment variable is not set', () => {
    expect.assertions(1)
    delete process.env.NEXT_PUBLIC_VERCEL_URL
    expect(() => {
      require('../next.config')
    }).toThrow(new Error('Env var "NEXT_PUBLIC_VERCEL_URL" is required.'))
  })
})

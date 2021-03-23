const mock = jest.createMockFromModule('next/router')

// https://nextjs.org/docs/api-reference/next/router#userouter
mock.useRouter = jest.fn(() => ({
  pathname: '/some-path/',
  query: {},
  asPath: '',
  back: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: jest.fn(),
  push: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),

  // ... other things here
}))
module.exports = mock

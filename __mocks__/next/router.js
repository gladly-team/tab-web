const genMockRouter = jest.createMockFromModule('next/router')

const mock = {
  ...genMockRouter.Router,

  // https://nextjs.org/docs/api-reference/next/router#userouter
  useRouter: jest.fn(() => ({
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
  })),
}

module.exports = mock

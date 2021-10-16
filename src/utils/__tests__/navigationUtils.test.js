import mockWindowLocation from 'src/utils/testHelpers/mockWindowLocation'

beforeAll(() => {
  process.env.REACT_APP_WEBSITE_PROTOCOL = 'https'
})

afterEach(() => {
  jest.clearAllMocks()
  jest.resetModules()
})

describe('isURLForDifferentApp', () => {
  it('[absolute URL] is *not* a different app when the URL is absolute with the same domain and a "newtab" path', () => {
    const { isURLForDifferentApp } = require('src/utils/navigationUtils')
    mockWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/path/',
      origin: 'https://example.com',
      pathname: '/newtab/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('https://example.com/newtab/path/')).toBe(false)
  })

  it('[absolute URL] is a different app when the URL is absolute with a different domain', () => {
    const { isURLForDifferentApp } = require('src/utils/navigationUtils')
    mockWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/path/',
      origin: 'https://example.com',
      pathname: '/newtab/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('https://foo.com/newtab/path/')).toBe(true)
  })

  it('[absolute URL] is a different app when the URL is absolute and on the same domain but with a non-"newtab" app subpath', () => {
    const { isURLForDifferentApp } = require('src/utils/navigationUtils')
    mockWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/path/',
      origin: 'https://example.com',
      pathname: '/newtab/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('https://example.com/something/path/')).toBe(
      true
    )
  })

  it('[relative URL] is *not* a different app if the URL is exactly the same with a "newtab" subpath', () => {
    const { isURLForDifferentApp } = require('src/utils/navigationUtils')
    mockWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/path/',
      origin: 'https://example.com',
      pathname: '/newtab/path/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/newtab/path/')).toBe(false)
  })

  it('[relative URL] is *not* a different app if the URL has a "newtab" subpath', () => {
    const { isURLForDifferentApp } = require('src/utils/navigationUtils')
    mockWindowLocation({
      host: 'example.com',
      hostname: 'example.com',
      href: 'https://example.com/newtab/thing/',
      origin: 'https://example.com',
      pathname: '/newtab/thing/',
      port: '',
      protocol: 'https:',
      search: '',
    })
    expect(isURLForDifferentApp('/newtab/foobar/')).toBe(false)
  })
})

describe('isAbsoluteURL', () => {
  it('works as expected', () => {
    const { isAbsoluteURL } = require('src/utils/navigationUtils')

    // Relative URLs
    expect(isAbsoluteURL('')).toBe(false)
    expect(isAbsoluteURL('/')).toBe(false)
    expect(isAbsoluteURL('/some/path')).toBe(false)
    expect(isAbsoluteURL('localhost:3000')).toBe(false)

    // Absolute URLs
    expect(isAbsoluteURL('https://example.com/blah/path/')).toBe(true)
    expect(isAbsoluteURL('http://example.com/blah/path/')).toBe(true)
    expect(isAbsoluteURL('https://example.com')).toBe(true)
    expect(isAbsoluteURL('http://localhost:3000')).toBe(true)
  })
})

describe('withBasePath', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_URLS_BASE_PATH = '/some-path'
  })

  it('adds the basePath, when it is defined, to a relative URL', () => {
    const { withBasePath } = require('src/utils/navigationUtils')
    expect(withBasePath('/my-url')).toEqual('/some-path/my-url')
  })

  it('does not add the basePath, when it is not defined, to a relative URL', () => {
    delete process.env.NEXT_PUBLIC_URLS_BASE_PATH
    const { withBasePath } = require('src/utils/navigationUtils')
    expect(withBasePath('/my-url')).toEqual('/my-url')
  })

  it('does not add the basePath to an absolute URL', () => {
    const { withBasePath } = require('src/utils/navigationUtils')
    expect(withBasePath('https://example.com/my-url')).toEqual(
      'https://example.com/my-url'
    )
  })
})

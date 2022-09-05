import { renderHook } from '@testing-library/react-hooks'
import { detect } from 'detect-browser'
import useBrowserInfo from 'src/utils/hooks/useBrowserInfo'
import { isServerSide } from 'src/utils/ssr'

jest.mock('detect-browser')
jest.mock('src/utils/ssr')

beforeEach(() => {
  isServerSide.mockReturnValue(false)
  detect.mockReturnValue({
    name: 'chrome',
    os: 'Mac OS',
    type: 'browser',
    version: '58.0.3029',
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('useBrowserInfo', () => {
  it('returns undefined on first render -- client side', () => {
    const { result } = renderHook(() => useBrowserInfo())
    expect(result.all[0]).toBeUndefined()
  })

  it('returns the expected browser info -- client side', () => {
    const { result } = renderHook(() => useBrowserInfo())
    expect(result.current).toEqual({
      name: 'chrome',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
  })

  it('returns undefined on first render -- client side with user agent (UA is ignored)', () => {
    isServerSide.mockReturnValue(false)
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    detect.mockReturnValue({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() =>
      useBrowserInfo({ userAgent: mockUserAgent })
    )
    expect(result.all[0]).toBeUndefined()
  })

  it('returns undefined on first render -- server side with no user agent', () => {
    isServerSide.mockReturnValue(true)
    const { result } = renderHook(() => useBrowserInfo())
    expect(result.all[0]).toBeUndefined()
  })

  it('returns info on first render -- server side with user agent', () => {
    isServerSide.mockReturnValue(true)
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    detect.mockReturnValue({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() =>
      useBrowserInfo({ userAgent: mockUserAgent })
    )
    expect(result.all[0]).toEqual({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
  })

  it('modifies the browser info if it is different on mount vs server-side', () => {
    isServerSide.mockReturnValue(true)
    const mockUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0'
    detect.mockImplementation((userAgent) => {
      if (userAgent) {
        return {
          name: 'firefox',
          os: 'Mac OS',
          type: 'browser',
          version: '58.0.3029',
        }
      }
      return {
        name: 'chrome',
        os: 'Mac OS',
        type: 'browser',
        version: '58.0.3029',
      }
    })
    const { result } = renderHook(() =>
      useBrowserInfo({ userAgent: mockUserAgent })
    )
    expect(result.all[0].name).toEqual('firefox')
    expect(result.all[1].name).toEqual('chrome')
  })
})

import { renderHook } from '@testing-library/react-hooks'
import { detect } from 'detect-browser'
import useDoesBrowserSupportSearchExtension from 'src/utils/hooks/useDoesBrowserSupportSearchExtension'

// Let's choose not to mock other browser detection utils.
jest.mock('detect-browser')

beforeEach(() => {
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

describe('useDoesBrowserSupportSearchExtension', () => {
  it('returns true on Chrome', () => {
    detect.mockReturnValue({
      name: 'chrome',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(true)
  })

  it('returns true on Chrome iOS', () => {
    detect.mockReturnValue({
      name: 'crios',
      os: 'iPhone',
      type: 'browser',
      version: '8.10.3',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(true)
  })

  it('returns true on Firefox', () => {
    detect.mockReturnValue({
      name: 'firefox',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(true)
  })

  it('returns false on Edge', () => {
    detect.mockReturnValue({
      name: 'edge',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Edge Chromium', () => {
    detect.mockReturnValue({
      name: 'edge-chromium',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Edge iOS', () => {
    detect.mockReturnValue({
      name: 'edge-ios',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Safari', () => {
    detect.mockReturnValue({
      name: 'safari',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })

  it('returns false on Opera', () => {
    detect.mockReturnValue({
      name: 'opera',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
    const { result } = renderHook(() => useDoesBrowserSupportSearchExtension())
    expect(result.current).toEqual(false)
  })
})

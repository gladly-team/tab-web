import { renderHook } from '@testing-library/react-hooks'
import { detect } from 'detect-browser'
import useBrowserInfo from 'src/utils/hooks/useBrowserInfo'

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

describe('useBrowserInfo', () => {
  it('returns undefined on first render', () => {
    const { result } = renderHook(() => useBrowserInfo())
    expect(result.all[0]).toBeUndefined()
  })

  it('returns the expected browser info', () => {
    const { result } = renderHook(() => useBrowserInfo())
    expect(result.current).toEqual({
      name: 'chrome',
      os: 'Mac OS',
      type: 'browser',
      version: '58.0.3029',
    })
  })
})

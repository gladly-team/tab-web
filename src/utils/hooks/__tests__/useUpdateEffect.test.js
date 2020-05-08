import { renderHook } from '@testing-library/react-hooks'
import useUpdateEffect from 'src/utils/hooks/useUpdateEffect'

describe('useUpdateEffect', () => {
  it('runs the callback function on every re-render except initial mount', () => {
    expect.assertions(3)
    const mockFn = jest.fn()
    const { rerender } = renderHook(() =>
      useUpdateEffect(() => {
        mockFn()
      })
    )
    expect(mockFn).not.toHaveBeenCalled()
    rerender()
    expect(mockFn).toHaveBeenCalledTimes(1)
    rerender()
    expect(mockFn).toHaveBeenCalledTimes(2)
  })
})

import { renderHook, act } from '@testing-library/react-hooks'
import useInterval from 'src/utils/hooks/useInterval'

beforeEach(() => {
  jest.useFakeTimers()
})

describe('useInterval', () => {
  it('should invoke the callback the expected number of times based on the interval', () => {
    const mockFn = jest.fn()
    const interval = 2000
    renderHook(() =>
      useInterval(() => {
        mockFn()
      }, interval)
    )

    const numIntervals = 4
    act(() => jest.advanceTimersByTime(interval * numIntervals + 1))
    expect(mockFn).toHaveBeenCalledTimes(numIntervals)
  })

  it('should stop invoking the callback when the component unmounts', () => {
    const mockFn = jest.fn()
    const interval = 2000
    const { unmount } = renderHook(() =>
      useInterval(() => {
        mockFn()
      }, interval)
    )

    // Advance the time.
    const numIntervals = 6
    act(() => jest.advanceTimersByTime(interval * numIntervals + 1))

    // Unmount.
    unmount()

    // Advance the time again, but we expect the interval to be
    // cleared.
    act(() => jest.advanceTimersByTime(interval * 8 + 1))
    expect(mockFn).toHaveBeenCalledTimes(numIntervals)
  })

  it('should recreate the setInterval if the interval value changes', () => {
    const mockFn = jest.fn()
    const firstIntervalVal = 2000
    const { rerender } = renderHook(
      ({ intervalVal }) =>
        useInterval(() => {
          mockFn()
        }, intervalVal),
      {
        initialProps: {
          intervalVal: firstIntervalVal,
        },
      }
    )

    // Advance the time.
    act(() => jest.advanceTimersByTime(12001)) // six intervals
    expect(mockFn).toHaveBeenCalledTimes(6)

    rerender({
      intervalVal: 1000,
    })

    // Advance the time again. This time we expect the callback
    // to be called each 1000ms.
    act(() => jest.advanceTimersByTime(12001)) // twelve intervals
    expect(mockFn).toHaveBeenCalledTimes(18) // 18 total = 6 + 12
  })
})

import { renderHook } from '@testing-library/react-hooks'
import usePrevious from 'src/utils/hooks/usePrevious'

describe('usePrevious', () => {
  it('returns the previous value provided to it', () => {
    expect.assertions(3)
    const { rerender, result } = renderHook(({ thing }) => usePrevious(thing), {
      initialProps: {
        thing: 'a',
      },
    })

    // The value previous to this is undefined.
    expect(result.current).toEqual(undefined)
    rerender({ thing: 'b' })
    expect(result.current).toEqual('a')
    rerender({ thing: 'foo' })
    expect(result.current).toEqual('b')
  })
})

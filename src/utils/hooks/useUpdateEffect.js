import { useEffect, useRef } from 'react'

// TODO: delete this until it's needed.

// Like useEffect but does not run on mount.
// https://stackoverflow.com/a/53180013
function useUpdateEffect(fn, inputs) {
  const didMountRef = useRef(false)

  useEffect(() => {
    if (didMountRef.current) {
      fn()
    } else {
      didMountRef.current = true
    }
  }, inputs) // eslint-disable-line
}

export default useUpdateEffect

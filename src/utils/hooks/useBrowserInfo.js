import { useEffect, useState } from 'react'
import { detect } from 'detect-browser'

const useBrowserInfo = () => {
  const [browserInfo, setBrowserInfo] = useState()
  useEffect(() => {
    setBrowserInfo(detect())
  }, [])
  return browserInfo
}

export default useBrowserInfo

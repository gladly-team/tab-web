import { useEffect, useState } from 'react'
import LogTabMutation from 'src/utils/mutations/LogTabMutation'

function useTabCount(userId, tabId) {
  const [tabData, updateTabData] = useState({})
  useEffect(() => {
    if (userId && tabId) {
      updateTabData(LogTabMutation(userId, tabId))
    }
  }, [userId, tabId])
  return tabData
}

export default useTabCount

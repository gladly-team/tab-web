/* eslint import/prefer-default-export: 0 */
/* globals window */
import { isClientSide } from 'src/utils/ssr'
import debounce from 'lodash/debounce'
// Delete all cached data.
export const clearAllServiceWorkerCaches = async () => {
  if (!isClientSide()) {
    throw new Error('Cannot clear service worker caches on the server side.')
  }
  const cacheNames = await window.caches.keys()
  return Promise.all(cacheNames.map((key) => window.caches.delete(key)))
}

// ideally caching should never be called server side and only used in
// a useEffect hook.  This is just defensive coding
export const recachePage = debounce(async () => {
  if (!isClientSide()) {
    return
  }
  const { caches } = window
  await caches.open('tab-resources').then((cache) => cache.add('/newtab/'))
}, 300)

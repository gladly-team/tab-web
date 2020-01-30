/* eslint import/prefer-default-export: 0 */
/* globals window */
import { isClientSide } from 'src/utils/ssr'

// Delete all cached data.
export const clearAllServiceWorkerCaches = async () => {
  if (!isClientSide()) {
    throw new Error('Cannot clear service worker caches on the server side.')
  }
  const cacheNames = await window.caches.keys()
  cacheNames.forEach(cacheName => {
    window.caches.delete(cacheName)
  })
}

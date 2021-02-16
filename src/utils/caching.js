/* eslint import/prefer-default-export: 0 */
/* globals window */
import { isClientSide } from 'src/utils/ssr'
// Delete all cached data.
export const clearAllServiceWorkerCaches = async () => {
  if (!isClientSide()) {
    throw new Error('Cannot clear service worker caches on the server side.')
  }
  const cacheNames = await window.caches.keys()
  return Promise.all(cacheNames.map((key) => window.caches.delete(key)))
}
export const recachePage = async () => {
  if (!isClientSide()) {
    return
  }
  const { caches } = window
  await caches.open('tab-resources').then((cache) => cache.add('/newtab/'))
}

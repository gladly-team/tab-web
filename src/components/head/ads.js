/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * Ads component that handles A/B testing between Raptive and BuySellAds.
 * Splits traffic 50/50 between the two ad providers based on a localStorage bucket.
 *
 * @param {Object} props - Component props
 * @param {string} props.causeId - The ID of the current cause for ad targeting
 * @returns {React.Component} Script tags for the selected ad provider
 */
export default function Ads({ causeId }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w, d) {
              // Check for URL parameter to set ad provider preference
              function checkAndSetAdProviderFromURL() {
                var BUCKET_KEY = 'tab_ad_provider_bucket_v3'

                try {
                  // Parse URL parameters
                  var urlParams = new URLSearchParams(w.location.search)
                  var adsParam = urlParams.get('ads')

                  // If ads parameter is present and valid, update localStorage
                  if (adsParam === 'buysellads' || adsParam === 'raptive') {
                    localStorage.setItem(BUCKET_KEY, adsParam)
                    console.log('[Ad Provider] Set via URL parameter: ' + adsParam)
                  }
                } catch (e) {
                  console.error('Failed to process URL parameter:', e)
                }
              }

              // A/B Test: Determine which ad provider to use
              function getAdProviderBucket() {
                var BUCKET_KEY = 'tab_ad_provider_bucket_v3'
                var bucket = null

                try {
                  bucket = localStorage.getItem(BUCKET_KEY)
                } catch (e) {
                  console.error('Failed to access localStorage:', e)
                }

                // To test Buy/Sell Ads via URL: ?ads=buysellads
                // To test Raptive via URL: ?ads=raptive
                // Or set via console:
                // localStorage.setItem('tab_ad_provider_bucket_v3', 'buysellads')
                // localStorage.setItem('tab_ad_provider_bucket_v3', 'raptive')
                // Or clear: localStorage.removeItem('tab_ad_provider_bucket_v3')
                if (!bucket) {
                  // Generate random bucket (0-99)
                  // 0-49 (50%) = buysellads, 50-99 (50%) = raptive
                  var randomValue = Math.floor(Math.random() * 100)
                  bucket = randomValue < 50 ? 'buysellads' : 'raptive'

                  try {
                    localStorage.setItem(BUCKET_KEY, bucket)
                  } catch (e) {
                    console.error('Failed to save to localStorage:', e)
                    // Default to raptive if localStorage fails
                    bucket = 'raptive'
                  }
                }

                return bucket
              }

              // Function to send log to Better Stack
              function sendBetterStackLog(adBucket, causeId) {
                try {
                  var timestamp = new Date().toISOString()
                  var logData = {
                    dt: timestamp,
                    message: 'Ad bucket selected: ' + adBucket,
                    ad_bucket: adBucket,
                    page: 'newtab',
                    cause_id: causeId || 'unknown'
                  }

                  // Send the log request
                  var xhr = new XMLHttpRequest()
                  xhr.open('POST', 'https://s1506080.eu-nbg-2.betterstackdata.com', true)
                  xhr.setRequestHeader('Content-Type', 'application/json')
                  xhr.setRequestHeader('Authorization', 'Bearer WTPPGq3DeQX21uKuHhyTseMN')
                  xhr.send(JSON.stringify(logData))

                  console.log('[Better Stack] Logging ad bucket:', adBucket, 'for cause:', causeId)
                } catch (e) {
                  console.error('[Better Stack] Failed to send log:', e)
                }
              }

              // Check URL parameters first to see if we need to update the ad provider
              checkAndSetAdProviderFromURL()

              var adBucket = getAdProviderBucket()
              console.log(
                '[Ad Provider] Current bucket:',
                adBucket,
                '| Testing mode - Use ?ads=buysellads or ?ads=raptive in URL to switch'
              )

              // Store the bucket in window for access in the second script
              w.tabAdsProvider = {
                bucket: adBucket,
                causeId: '${causeId}'
              }

              // Send log to Better Stack with 500ms delay to not block ads
              setTimeout(function() {
                sendBetterStackLog(adBucket, '${causeId}')
              }, 500)

              if (adBucket === 'raptive') {
                // Load Raptive Ads (50% of users)
                w.adthrive = w.adthrive || {}
                w.adthrive.cmd = w.adthrive.cmd || []
                w.adthrive.plugin = 'adthrive-ads-manual'
                w.adthrive.host = 'ads.adthrive.com'
                var s = d.createElement('script')
                s.async = true
                s.referrerpolicy = 'no-referrer-when-downgrade'
                s.src = 'https://' + w.adthrive.host + '/sites/655cd66352dfc71af0778a48/ads.min.js?referrer=' + w.encodeURIComponent(w.location.href) + '&cb=' + (Math.floor(Math.random() * 100) + 1)
                var n = d.getElementsByTagName('script')[0]
                n.parentNode.insertBefore(s, n)
              } else if (adBucket === 'buysellads') {
                // Load BuySellAds (50% of users)
                ;(function() {
                  var bsa_optimize = document.createElement('script')
                  bsa_optimize.type = 'text/javascript'
                  bsa_optimize.async = true
                  bsa_optimize.src = 'https://cdn4.buysellads.net/pub/gladly.js?' + (new Date() - (new Date() % 600000))
                  ;(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(bsa_optimize)
                })()

                window.optimize = window.optimize || {
                  queue: []
                }
              }
            })(window, document);`,
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `(function() {
            // Set up targeting based on which ad provider was selected
            if (window.tabAdsProvider) {
              var bucket = window.tabAdsProvider.bucket
              var causeId = window.tabAdsProvider.causeId

              if (bucket === 'raptive' && window.adthrive) {
                // Set Raptive targeting for cause
                window.adthrive.cmd.push(function() {
                  window.adthrive.siteAds.targeting.push({
                    key: 'at_custom_1',
                    value: causeId
                  })
                })
              } else if (bucket === 'buysellads' && window.optimize) {
                // Set BuySellAds targeting for cause
                window.optimize.queue.push(function() {
                  window.optimize.customTargeting = window.optimize.customTargeting || []
                  window.optimize.customTargeting.push({
                    key: 'cause',
                    value: causeId || 'legacy'
                  })
                })
              }
            }
          })();`,
        }}
      />
    </>
  )
}

Ads.propTypes = {
  causeId: PropTypes.string,
}

Ads.defaultProps = {
  causeId: '',
}

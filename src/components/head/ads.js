/* eslint react/no-danger: 0 */
import React from 'react'
import PropTypes from 'prop-types'

/**
 * Ads component that loads Raptive (AdThrive) ads.
 * Initializes the Raptive ad script and sets cause-based targeting.
 *
 * @param {Object} props - Component props
 * @param {string} props.causeId - The ID of the current cause for ad targeting
 * @returns {React.Component} Script tags for Raptive ad loading
 */
export default function Ads({ causeId }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w, d) {
              // Initialize and load Raptive Ads
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

              // Set Raptive targeting for cause
              var causeId = '${causeId}'
              w.adthrive.cmd.push(function() {
                w.adthrive.siteAds.targeting.push({
                  key: 'at_custom_1',
                  value: causeId
                })
              })
            })(window, document);`,
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
